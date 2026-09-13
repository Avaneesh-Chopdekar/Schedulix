<?php
declare(strict_types=1);

require_once __DIR__ . "/../models/Timetable.php";

class TimetableRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAll(): array {
        $stmt = $this->db->query("SELECT * FROM timetable ORDER BY timetable_id DESC");
        $slots = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $slots[] = new Timetable(
                (int) $row['timetable_id'],
                (int) $row['generation_id'],
                (int) $row['subject_id'],
                (int) $row['teacher_id'],
                (int) $row['classroom_id'],
                (int) $row['time_slot_id'],
                (int) $row['section_id']
            );
        }
        return $slots;
    }

    public function create(array $data): int {
        $sql = "INSERT INTO timetable (generation_id, subject_id, teacher_id, classroom_id, time_slot_id, section_id)
                VALUES (:generation, :subject, :teacher, :classroom, :slot, :section)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':generation' => (int) $data['generation_id'],
            ':subject' => (int) $data['subject_id'],
            ':teacher' => (int) $data['teacher_id'],
            ':classroom' => (int) $data['classroom_id'],
            ':slot' => (int) $data['time_slot_id'],
            ':section' => (int) $data['section_id']
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $sql = "UPDATE timetable 
                SET generation_id = :generation, subject_id = :subject, teacher_id = :teacher, 
                    classroom_id = :classroom, time_slot_id = :slot, section_id = :section
                WHERE timetable_id = :id";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':generation' => (int) $data['generation_id'],
            ':subject' => (int) $data['subject_id'],
            ':teacher' => (int) $data['teacher_id'],
            ':classroom' => (int) $data['classroom_id'],
            ':slot' => (int) $data['time_slot_id'],
            ':section' => (int) $data['section_id'],
            ':id' => $id
        ]);

        if ($stmt->rowCount() === 0) {
            throw new Exception("Update failed: Timetable slot not found or data is identical.");
        }
        return true;
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM timetable WHERE timetable_id = :id");
        return $stmt->execute([':id' => $id]);
    }
}