<?php
declare(strict_types=1);

require_once __DIR__ . "/../models/SchedulingConstraint.php";

class SchedulingConstraintRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAll(): array {
        $stmt = $this->db->query("SELECT * FROM scheduling_constraints ORDER BY priority DESC");
        
        $constraints = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $constraints[] = new SchedulingConstraint(
                (int) $row['constraint_id'],
                $row['constraint_type'],
                $row['constraint_name'],
                $row['description'],
                (bool) $row['is_hard_constraint'],
                (bool) $row['is_active'],
                (int) $row['priority']
            );
        }
        
        return $constraints;
    }

    public function create(array $data): int {
        $sql = "INSERT INTO scheduling_constraints (constraint_type, constraint_name, description, is_hard_constraint, is_active, priority)
                VALUES (:type, :name, :description, :is_hard, :is_active, :priority)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':type' => $data['constraint_type'],
            ':name' => $data['constraint_name'],
            ':description' => $data['description'] ?? null,
            ':is_hard' => (int) ($data['is_hard_constraint'] ?? 1),
            ':is_active' => (int) ($data['is_active'] ?? 1),
            ':priority' => (int) ($data['priority'] ?? 1)
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $sql = "UPDATE scheduling_constraints 
                SET constraint_type = :type, constraint_name = :name, description = :description, 
                    is_hard_constraint = :is_hard, is_active = :is_active, priority = :priority
                WHERE constraint_id = :id";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':type' => $data['constraint_type'],
            ':name' => $data['constraint_name'],
            ':description' => $data['description'] ?? null,
            ':is_hard' => (int) ($data['is_hard_constraint'] ?? 1), 
            ':is_active' => (int) ($data['is_active'] ?? 1),
            ':priority' => (int) ($data['priority'] ?? 1),
            ':id' => $id
        ]);

        if ($stmt->rowCount() === 0) {
            throw new Exception("Update failed: No constraint found with ID $id, or the data you sent is identical to what is already saved.");
        }
        
        return true;
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM scheduling_constraints WHERE constraint_id = :id");
        return $stmt->execute([':id' => $id]);
    }
}