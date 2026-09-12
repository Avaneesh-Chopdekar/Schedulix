<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/Department.php";

class DepartmentRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function findAll(): array
    {
        $stmt = $this->db->query(
            'SELECT
                department_id,
                department_name,
                created_at
             FROM departments
             ORDER BY department_id',
        );

        $departments = [];

        while ($row = $stmt->fetch()) {
            $departments[] = new Department(
                (int) $row["department_id"],
                $row["department_name"],
                $row["created_at"],
            );
        }

        return $departments;
    }

    public function findById(int $departmentId): ?Department
    {
        $stmt = $this->db->prepare(
            'SELECT
                department_id,
                department_name,
                created_at
             FROM departments
             WHERE department_id = :id',
        );

        $stmt->execute([
            "id" => $departmentId,
        ]);

        $row = $stmt->fetch();

        if ($row === false) {
            return null;
        }

        return new Department(
            (int) $row["department_id"],
            $row["department_name"],
            $row["created_at"],
        );
    }
}
