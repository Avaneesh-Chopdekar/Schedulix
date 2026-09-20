<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/Teacher.php";

class TeacherRepository
{
    private PDO $connection;

    public function __construct()
    {
        $this->connection = Database::getConnection();
    }

    public function getAll(): array
    {
        $sql = "
            SELECT
                teacher_id,
                user_id,
                department_id,
                employee_id,
                designation,
                employment_type,
                created_at,
                updated_at
            FROM teachers
            ORDER BY employee_id ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        $teachers = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $teachers[] = $this->createTeacher($row);
        }

        return $teachers;
    }

    public function getById(int $id): ?Teacher
    {
        $sql = "
            SELECT
                teacher_id,
                user_id,
                department_id,
                employee_id,
                designation,
                employment_type,
                created_at,
                updated_at
            FROM teachers
            WHERE teacher_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createTeacher($row);
    }

    public function getByUserId(int $userId, ?int $excludeId = null): ?Teacher
    {
        if ($excludeId === null) {
            $sql = "
                SELECT
                    teacher_id,
                    user_id,
                    department_id,
                    employee_id,
                    designation,
                    employment_type,
                    created_at,
                    updated_at
                FROM teachers
                WHERE user_id = :user_id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "user_id" => $userId,
            ]);
        } else {
            $sql = "
                SELECT
                    teacher_id,
                    user_id,
                    department_id,
                    employee_id,
                    designation,
                    employment_type,
                    created_at,
                    updated_at
                FROM teachers
                WHERE user_id = :user_id
                AND teacher_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "user_id" => $userId,
                "id" => $excludeId,
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createTeacher($row);
    }

    public function getByEmployeeId(
        string $employeeId,
        ?int $excludeId = null,
    ): ?Teacher {
        if ($excludeId === null) {
            $sql = "
                SELECT
                    teacher_id,
                    user_id,
                    department_id,
                    employee_id,
                    designation,
                    employment_type,
                    created_at,
                    updated_at
                FROM teachers
                WHERE employee_id = :employee_id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "employee_id" => $employeeId,
            ]);
        } else {
            $sql = "
                SELECT
                    teacher_id,
                    user_id,
                    department_id,
                    employee_id,
                    designation,
                    employment_type,
                    created_at,
                    updated_at
                FROM teachers
                WHERE employee_id = :employee_id
                AND teacher_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "employee_id" => $employeeId,
                "id" => $excludeId,
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createTeacher($row);
    }

    public function getByDepartment(int $departmentId): array
    {
        $sql = "
            SELECT
                teacher_id,
                user_id,
                department_id,
                employee_id,
                designation,
                employment_type,
                created_at,
                updated_at
            FROM teachers
            WHERE department_id = :department_id
            ORDER BY employee_id ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "department_id" => $departmentId,
        ]);

        $teachers = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $teachers[] = $this->createTeacher($row);
        }

        return $teachers;
    }

    public function create(
        int $userId,
        int $departmentId,
        string $employeeId,
        string $designation,
        string $employmentType,
    ): Teacher {
        $sql = "
            INSERT INTO teachers
            (
                user_id,
                department_id,
                employee_id,
                designation,
                employment_type
            )
            VALUES
            (
                :user_id,
                :department_id,
                :employee_id,
                :designation,
                :employment_type
            )
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "user_id" => $userId,
            "department_id" => $departmentId,
            "employee_id" => $employeeId,
            "designation" => $designation,
            "employment_type" => $employmentType,
        ]);

        return $this->getById((int) $this->connection->lastInsertId());
    }

    public function update(
        int $id,
        int $userId,
        int $departmentId,
        string $employeeId,
        string $designation,
        string $employmentType,
    ): ?Teacher {
        $sql = "
            UPDATE teachers
            SET
                user_id = :user_id,
                department_id = :department_id,
                employee_id = :employee_id,
                designation = :designation,
                employment_type = :employment_type
            WHERE teacher_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "user_id" => $userId,
            "department_id" => $departmentId,
            "employee_id" => $employeeId,
            "designation" => $designation,
            "employment_type" => $employmentType,
            "id" => $id,
        ]);

        return $this->getById($id);
    }

    public function delete(int $id): bool
    {
        $sql = "
            DELETE FROM teachers
            WHERE teacher_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        return $stmt->rowCount() > 0;
    }

    private function createTeacher(array $row): Teacher
    {
        return new Teacher(
            (int) $row["teacher_id"],
            (int) $row["user_id"],
            (int) $row["department_id"],
            $row["employee_id"],
            $row["designation"],
            $row["employment_type"],
            $row["created_at"],
            $row["updated_at"],
        );
    }
}
