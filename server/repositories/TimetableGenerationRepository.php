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
                (int) $row['generated_by']
            );
        }
        return $generations;
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
}