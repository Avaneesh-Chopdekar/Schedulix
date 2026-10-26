<?php
declare(strict_types=1);

require_once __DIR__ . "/../models/Timetable.php";

class TimetableRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAll(?int $generationId = null): array {
        if ($generationId !== null) {
            $stmt = $this->db->prepare(
                "SELECT * FROM timetable
                 WHERE generation_id = :generation
                 ORDER BY timetable_id DESC"
            );
            $stmt->execute(['generation' => $generationId]);
        } else {
            $stmt = $this->db->query("SELECT * FROM timetable ORDER BY timetable_id DESC");
        }
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

    public function getByGeneration(int $generationId): array {
        return $this->getAll($generationId);
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
        $currentStmt = $this->db->prepare("SELECT * FROM timetable WHERE timetable_id = :id");
        $currentStmt->execute([':id' => $id]);
        $current = $currentStmt->fetch(PDO::FETCH_ASSOC);
        if (!$current) {
            throw new InvalidArgumentException("Timetable entry not found.");
        }
        $conflict = $this->db->prepare(
            "SELECT timetable_id FROM timetable
             WHERE generation_id = :generation
               AND time_slot_id = :slot
               AND timetable_id != :id
               AND (teacher_id = :teacher OR classroom_id = :classroom OR section_id = :section)
             LIMIT 1"
        );
        $conflict->execute([
            ':generation' => (int) $data['generation_id'],
            ':slot' => (int) $data['time_slot_id'],
            ':teacher' => (int) $data['teacher_id'],
            ':classroom' => (int) $data['classroom_id'],
            ':section' => (int) $data['section_id'],
            ':id' => $id,
        ]);
        if ($conflict->fetchColumn() !== false) {
            throw new InvalidArgumentException("The selected time slot conflicts with another timetable entry.");
        }
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
        $changedBy = (int) ($data['changed_by'] ?? 0);
        if ($changedBy > 0) {
            $history = $this->db->prepare(
                "INSERT INTO timetable_changes
                 (timetable_id, generation_id, changed_by, old_values, new_values)
                 VALUES (:timetable, :generation, :user, :old_values, :new_values)"
            );
            $history->execute([
                ':timetable' => $id,
                ':generation' => (int) $data['generation_id'],
                ':user' => $changedBy,
                ':old_values' => json_encode($current, JSON_THROW_ON_ERROR),
                ':new_values' => json_encode($data, JSON_THROW_ON_ERROR),
            ]);
        }
        return true;
    }

    public function getChanges(?int $generationId = null): array {
        $sql = "SELECT change_id, timetable_id, generation_id, changed_by, old_values, new_values, changed_at
                FROM timetable_changes";
        $params = [];
        if ($generationId !== null) {
            $sql .= " WHERE generation_id = :generation";
            $params[':generation'] = $generationId;
        }
        $sql .= " ORDER BY changed_at DESC, change_id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM timetable WHERE timetable_id = :id");
        return $stmt->execute([':id' => $id]);
    }
}