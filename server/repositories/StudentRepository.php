<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/Student.php";

class StudentRepository
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
                student_id,
                user_id,
                roll_number,
                section_id,
                admission_year,
                created_at,
                updated_at
            FROM students
            ORDER BY roll_number ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        $students = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $students[] = $this->createStudent($row);
        }

        return $students;
    }

    public function getById(int $id): ?Student
    {
        $sql = "
            SELECT
                student_id,
                user_id,
                roll_number,
                section_id,
                admission_year,
                created_at,
                updated_at
            FROM students
            WHERE student_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createStudent($row);
    }

    public function getByUserId(int $userId, ?int $excludeId = null): ?Student
    {
        if ($excludeId === null) {
            $sql = "
                SELECT
                    student_id,
                    user_id,
                    roll_number,
                    section_id,
                    admission_year,
                    created_at,
                    updated_at
                FROM students
                WHERE user_id = :user_id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "user_id" => $userId,
            ]);
        } else {
            $sql = "
                SELECT
                    student_id,
                    user_id,
                    roll_number,
                    section_id,
                    admission_year,
                    created_at,
                    updated_at
                FROM students
                WHERE user_id = :user_id
                AND student_id != :id
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

        return $this->createStudent($row);
    }

    public function getByRollNumber(
        string $rollNumber,
        ?int $excludeId = null,
    ): ?Student {
        if ($excludeId === null) {
            $sql = "
                SELECT
                    student_id,
                    user_id,
                    roll_number,
                    section_id,
                    admission_year,
                    created_at,
                    updated_at
                FROM students
                WHERE roll_number = :roll_number
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "roll_number" => $rollNumber,
            ]);
        } else {
            $sql = "
                SELECT
                    student_id,
                    user_id,
                    roll_number,
                    section_id,
                    admission_year,
                    created_at,
                    updated_at
                FROM students
                WHERE roll_number = :roll_number
                AND student_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "roll_number" => $rollNumber,
                "id" => $excludeId,
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createStudent($row);
    }

    public function getBySection(int $sectionId): array
    {
        $sql = "
            SELECT
                student_id,
                user_id,
                roll_number,
                section_id,
                admission_year,
                created_at,
                updated_at
            FROM students
            WHERE section_id = :section_id
            ORDER BY roll_number ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "section_id" => $sectionId,
        ]);

        $students = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $students[] = $this->createStudent($row);
        }

        return $students;
    }

    public function create(
        int $userId,
        string $rollNumber,
        int $sectionId,
        int $admissionYear,
    ): Student {
        $sql = "
            INSERT INTO students
            (
                user_id,
                roll_number,
                section_id,
                admission_year
            )
            VALUES
            (
                :user_id,
                :roll_number,
                :section_id,
                :admission_year
            )
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "user_id" => $userId,
            "roll_number" => $rollNumber,
            "section_id" => $sectionId,
            "admission_year" => $admissionYear,
        ]);

        return $this->getById((int) $this->connection->lastInsertId());
    }

    public function update(
        int $id,
        int $userId,
        string $rollNumber,
        int $sectionId,
        int $admissionYear,
    ): ?Student {
        $sql = "
            UPDATE students
            SET
                user_id = :user_id,
                roll_number = :roll_number,
                section_id = :section_id,
                admission_year = :admission_year
            WHERE student_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "user_id" => $userId,
            "roll_number" => $rollNumber,
            "section_id" => $sectionId,
            "admission_year" => $admissionYear,
            "id" => $id,
        ]);

        return $this->getById($id);
    }

    public function delete(int $id): bool
    {
        $sql = "
            DELETE FROM students
            WHERE student_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        return $stmt->rowCount() > 0;
    }

    private function createStudent(array $row): Student
    {
        return new Student(
            (int) $row["student_id"],
            (int) $row["user_id"],
            $row["roll_number"],
            (int) $row["section_id"],
            (int) $row["admission_year"],
            $row["created_at"],
            $row["updated_at"],
        );
    }
}
