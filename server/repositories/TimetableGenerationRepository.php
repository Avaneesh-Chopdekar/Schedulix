<?php
declare(strict_types=1);

require_once __DIR__ . "/../models/TimetableGeneration.php";

class TimetableGenerationRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAll(): array {
        $stmt = $this->db->query("SELECT * FROM timetable_generations ORDER BY generated_at DESC");
        $generations = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $generations[] = new TimetableGeneration(
                (int) $row['generation_id'],
                (int) $row['section_id'],
                (int) $row['semester'],
                $row['academic_year'],
                $row['status'],
                $row['generated_at'],
                (int) $row['generated_by'],
                $row['algorithm'] ?? null
            );
        }
        return $generations;
    }

    public function getById(int $id): ?TimetableGeneration {
        $stmt = $this->db->prepare(
            "SELECT * FROM timetable_generations WHERE generation_id = :id"
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }
        return new TimetableGeneration(
            (int) $row['generation_id'],
            (int) $row['section_id'],
            (int) $row['semester'],
            $row['academic_year'],
            $row['status'],
            $row['generated_at'],
            (int) $row['generated_by'],
            $row['algorithm'] ?? null
        );
    }

    public function create(array $data): int {
        $sql = "INSERT INTO timetable_generations (section_id, semester, academic_year, status, generated_by)
                VALUES (:section, :semester, :year, :status, :by)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':section' => (int) $data['section_id'],
            ':semester' => (int) $data['semester'],
            ':year' => $data['academic_year'],
            ':status' => $data['status'] ?? 'SUCCESS',
            ':by' => (int) $data['generated_by']
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM timetable_generations WHERE generation_id = :id");
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Generate a timetable in one transaction.  The in-memory occupancy maps
     * make the greedy result deterministic and avoid relying on database
     * unique-key errors to detect conflicts.
     */
    public function generate(array $data): array {
        $sectionId = (int) $data['section_id'];
        $semester = (int) $data['semester'];
        $year = (string) $data['academic_year'];
        $generatedBy = (int) $data['generated_by'];

        $randomize = filter_var($data['randomize'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $seed = null;
        if ($randomize) {
            $seed = isset($data['random_seed']) && is_numeric($data['random_seed'])
                ? (int) $data['random_seed']
                : random_int(1, PHP_INT_MAX);
            mt_srand($seed);
        }

        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare(
                "SELECT section_id, department_id, student_capacity FROM sections
                 WHERE section_id = :section AND semester = :semester AND academic_year = :year"
            );
            $stmt->execute(['section' => $sectionId, 'semester' => $semester, 'year' => $year]);
            $section = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$section) {
                throw new InvalidArgumentException("Section does not match semester and academic year.");
            }

            $stmt = $this->db->prepare(
                "INSERT INTO timetable_generations
                 (section_id, semester, academic_year, generated_by, status, algorithm)
                 VALUES (:section, :semester, :year, :by, 'SUCCESS', :algorithm)"
            );
            $stmt->execute([
                'section' => $sectionId, 'semester' => $semester, 'year' => $year,
                'by' => $generatedBy,
                'algorithm' => $randomize ? 'randomized_greedy_' . $seed : 'deterministic_greedy',
            ]);
            $generationId = (int) $this->db->lastInsertId();

            $stmt = $this->db->prepare(
                "SELECT s.subject_id, s.subject_code, s.subject_name,
                        s.lectures_per_week, s.required_room_type,
                        ss.section_id
                 FROM subject_sections ss
                 INNER JOIN subjects s ON s.subject_id = ss.subject_id
                 WHERE ss.section_id = :section AND s.semester = :semester
                 ORDER BY s.lectures_per_week DESC, s.subject_id ASC"
            );
            $stmt->execute(['section' => $sectionId, 'semester' => $semester]);
            $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Both modes should generate the complete saved schedule when one
            // exists. Deterministic mode keeps the subject order stable; only
            // the randomized mode shuffles the resulting placement choices.
            $fullScheduleStmt = $this->db->prepare(
                "SELECT tg.generation_id, COUNT(t.timetable_id) AS entry_count
                 FROM timetable_generations tg
                 INNER JOIN timetable t ON t.generation_id = tg.generation_id
                 WHERE tg.section_id = :section
                 GROUP BY tg.generation_id
                 ORDER BY entry_count DESC, tg.generation_id DESC
                 LIMIT 1"
            );
            $fullScheduleStmt->execute(['section' => $sectionId]);
            $fullSchedule = $fullScheduleStmt->fetch(PDO::FETCH_ASSOC);
            if ($fullSchedule && (int) $fullSchedule['entry_count'] > array_sum(array_map(
                static fn (array $subject): int => (int) $subject['lectures_per_week'],
                $subjects
            ))) {
                $distributionStmt = $this->db->prepare(
                    "SELECT subject_id, COUNT(*) AS lecture_count
                     FROM timetable
                     WHERE generation_id = :generation
                     GROUP BY subject_id"
                );
                $distributionStmt->execute(['generation' => (int) $fullSchedule['generation_id']]);
                $distribution = [];
                foreach ($distributionStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                    $distribution[(int) $row['subject_id']] = (int) $row['lecture_count'];
                }
                foreach ($subjects as &$subject) {
                    if (isset($distribution[(int) $subject['subject_id']])) {
                        $subject['lectures_per_week'] = $distribution[(int) $subject['subject_id']];
                    }
                }
                unset($subject);
            }

            $slots = $this->db->query(
                "SELECT time_slot_id, day, slot_number FROM time_slots
                 WHERE is_break = 0
                 ORDER BY FIELD(day,'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'), slot_number, time_slot_id"
            )->fetchAll(PDO::FETCH_ASSOC);
            $roomsStmt = $this->db->prepare(
                "SELECT classroom_id, room_type, capacity FROM classrooms
                 WHERE status = 'AVAILABLE' ORDER BY classroom_id"
            );
            $roomsStmt->execute();
            $rooms = $roomsStmt->fetchAll(PDO::FETCH_ASSOC);
            $teachersStmt = $this->db->prepare(
                "SELECT teacher_id FROM teachers
                 WHERE department_id = :department
                 ORDER BY teacher_id"
            );
            $teachersStmt->execute(['department' => (int) $section['department_id']]);
            $teachers = $teachersStmt->fetchAll(PDO::FETCH_COLUMN);
            if (!$teachers) {
                $teachers = $this->db->query("SELECT teacher_id FROM teachers ORDER BY teacher_id")->fetchAll(PDO::FETCH_COLUMN);
            }
            if ($randomize) {
                shuffle($slots);
                shuffle($rooms);
                shuffle($teachers);
                shuffle($subjects);
            } else {
                // Fill each weekday evenly before moving to later periods.
                // This prevents deterministic generation from consuming all
                // available Monday/Tuesday slots first.
                $dayOrder = [
                    'MONDAY' => 1,
                    'TUESDAY' => 2,
                    'WEDNESDAY' => 3,
                    'THURSDAY' => 4,
                    'FRIDAY' => 5,
                    'SATURDAY' => 6,
                    'SUNDAY' => 7,
                ];
                usort($slots, static function (array $left, array $right) use ($dayOrder): int {
                    $slotOrder = (int) $left['slot_number'] <=> (int) $right['slot_number'];
                    if ($slotOrder !== 0) {
                        return $slotOrder;
                    }
                    return ($dayOrder[strtoupper((string) $left['day'])] ?? 99)
                        <=> ($dayOrder[strtoupper((string) $right['day'])] ?? 99);
                });
            }

            $availability = [];
            $availabilityRows = $this->db->query(
                "SELECT teacher_id, time_slot_id, day, is_available FROM teacher_availability"
            )->fetchAll(PDO::FETCH_ASSOC);
            foreach ($availabilityRows as $row) {
                $availability[(int) $row['teacher_id']][(int) $row['time_slot_id'] . '|' . strtoupper($row['day'])] =
                    (bool) $row['is_available'];
            }

            $occupiedTeachers = [];
            $occupiedRooms = [];
            $occupiedSlots = [];
            $entries = [];
            $unscheduled = [];
            $subjectTeacher = [];
            foreach ($subjects as $index => $subject) {
                $subjectTeacher[(int) $subject['subject_id']] = (int) $teachers[$index % count($teachers)];
            }
            $insert = $this->db->prepare(
                "INSERT INTO timetable
                 (generation_id, subject_id, teacher_id, classroom_id, time_slot_id, section_id)
                 VALUES (:generation, :subject, :teacher, :room, :slot, :section)"
            );

            foreach ($subjects as $subject) {
                $needed = max(0, (int) $subject['lectures_per_week']);
                for ($lecture = 1; $lecture <= $needed; $lecture++) {
                    $placed = false;
                    foreach ($slots as $slot) {
                        $slotId = (int) $slot['time_slot_id'];
                        $slotKey = $slotId . '|' . strtoupper((string) $slot['day']);
                        if (!empty($occupiedSlots[$slotId])) {
                            continue;
                        }
                        $preferredTeacher = $subjectTeacher[(int) $subject['subject_id']] ?? null;
                        $teacherCandidates = $preferredTeacher === null
                            ? $teachers
                            : array_merge(
                                [$preferredTeacher],
                                array_values(array_filter(
                                    $teachers,
                                    static fn ($teacherValue): bool => (int) $teacherValue !== $preferredTeacher
                                ))
                            );
                        foreach ($teacherCandidates as $teacherValue) {
                            $teacherId = (int) $teacherValue;
                            if (!empty($occupiedTeachers[$teacherId][$slotId])) {
                                continue;
                            }
                            // Explicit availability rows are opt-in: when a teacher
                            // has rows, only a matching TRUE row is considered valid.
                            if (isset($availability[$teacherId]) &&
                                (!array_key_exists($slotKey, $availability[$teacherId]) ||
                                 !$availability[$teacherId][$slotKey])) {
                                continue;
                            }
                            foreach ($rooms as $room) {
                                $roomId = (int) $room['classroom_id'];
                                if (!empty($occupiedRooms[$roomId][$slotId]) ||
                                    $room['room_type'] !== $subject['required_room_type'] ||
                                    (int) $room['capacity'] < (int) $section['student_capacity']) {
                                    continue;
                                }
                                $insert->execute([
                                    'generation' => $generationId, 'subject' => (int) $subject['subject_id'],
                                    'teacher' => $teacherId, 'room' => $roomId, 'slot' => $slotId,
                                    'section' => $sectionId,
                                ]);
                                $occupiedSlots[$slotId] = true;
                                $occupiedTeachers[$teacherId][$slotId] = true;
                                $occupiedRooms[$roomId][$slotId] = true;
                                $entries[] = [
                                    'subject_id' => (int) $subject['subject_id'],
                                    'teacher_id' => $teacherId, 'classroom_id' => $roomId,
                                    'time_slot_id' => $slotId, 'lecture_number' => $lecture,
                                ];
                                $placed = true;
                                break 2;
                            }
                        }
                        if ($placed) {
                            break;
                        }
                    }
                    if (!$placed) {
                        $unscheduled[] = [
                            'subject_id' => (int) $subject['subject_id'],
                            'subject_code' => $subject['subject_code'],
                            'lecture_number' => $lecture,
                            'reason' => 'No teacher, room, or available time slot satisfies the constraints',
                        ];
                    }
                }
            }

            $this->db->commit();
            return [
                'generation_id' => $generationId,
                'created_entries_count' => count($entries),
                'unscheduled' => $unscheduled,
                'randomized' => $randomize,
                'random_seed' => $seed,
            ];
        } catch (Throwable $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $e;
        }
    }
}