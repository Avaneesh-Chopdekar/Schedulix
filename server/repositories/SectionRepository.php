<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/Section.php";

class SectionRepository
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
                section_id,
                section_name,
                semester,
                academic_year,
                department_id,
                student_capacity,
                created_at
            FROM sections
            ORDER BY
                academic_year ASC,
                semester ASC,
                section_name ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        $sections = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sections[] = $this->createSection($row);
        }

        return $sections;
    }

    public function getById(int $id): ?Section
    {
        $sql = "
            SELECT
                section_id,
                section_name,
                semester,
                academic_year,
                department_id,
                student_capacity,
                created_at
            FROM sections
            WHERE section_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createSection($row);
    }

    public function getByDepartment(int $departmentId): array
    {
        $sql = "
            SELECT
                section_id,
                section_name,
                semester,
                academic_year,
                department_id,
                student_capacity,
                created_at
            FROM sections
            WHERE department_id = :department_id
            ORDER BY
                semester ASC,
                section_name ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "department_id" => $departmentId,
        ]);

        $sections = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sections[] = $this->createSection($row);
        }

        return $sections;
    }

    public function getBySemester(int $semester): array
    {
        $sql = "
            SELECT
                section_id,
                section_name,
                semester,
                academic_year,
                department_id,
                student_capacity,
                created_at
            FROM sections
            WHERE semester = :semester
            ORDER BY
                academic_year ASC,
                section_name ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "semester" => $semester,
        ]);

        $sections = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sections[] = $this->createSection($row);
        }

        return $sections;
    }

    public function getByAcademicYear(string $academicYear): array
    {
        $sql = "
            SELECT
                section_id,
                section_name,
                semester,
                academic_year,
                department_id,
                student_capacity,
                created_at
            FROM sections
            WHERE academic_year = :academic_year
            ORDER BY
                semester ASC,
                section_name ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "academic_year" => $academicYear,
        ]);

        $sections = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sections[] = $this->createSection($row);
        }

        return $sections;
    }

    public function getByDetails(
        string $sectionName,
        int $semester,
        string $academicYear,
        int $departmentId,
        ?int $excludeId = null,
    ): ?Section {
        if ($excludeId === null) {
            $sql = "
                SELECT
                    section_id,
                    section_name,
                    semester,
                    academic_year,
                    department_id,
                    student_capacity,
                    created_at
                FROM sections
                WHERE section_name = :section_name
                AND semester = :semester
                AND academic_year = :academic_year
                AND department_id = :department_id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "section_name" => $sectionName,
                "semester" => $semester,
                "academic_year" => $academicYear,
                "department_id" => $departmentId,
            ]);
        } else {
            $sql = "
                SELECT
                    section_id,
                    section_name,
                    semester,
                    academic_year,
                    department_id,
                    student_capacity,
                    created_at
                FROM sections
                WHERE section_name = :section_name
                AND semester = :semester
                AND academic_year = :academic_year
                AND department_id = :department_id
                AND section_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "section_name" => $sectionName,
                "semester" => $semester,
                "academic_year" => $academicYear,
                "department_id" => $departmentId,
                "id" => $excludeId,
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createSection($row);
    }

    public function create(
        string $sectionName,
        int $semester,
        string $academicYear,
        int $departmentId,
        int $studentCapacity,
    ): Section {
        $sql = "
            INSERT INTO sections
            (
                section_name,
                semester,
                academic_year,
                department_id,
                student_capacity
            )
            VALUES
            (
                :section_name,
                :semester,
                :academic_year,
                :department_id,
                :student_capacity
            )
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "section_name" => $sectionName,
            "semester" => $semester,
            "academic_year" => $academicYear,
            "department_id" => $departmentId,
            "student_capacity" => $studentCapacity,
        ]);

        return $this->getById((int) $this->connection->lastInsertId());
    }

    public function update(
        int $id,
        string $sectionName,
        int $semester,
        string $academicYear,
        int $departmentId,
        int $studentCapacity,
    ): ?Section {
        $sql = "
            UPDATE sections
            SET
                section_name = :section_name,
                semester = :semester,
                academic_year = :academic_year,
                department_id = :department_id,
                student_capacity = :student_capacity
            WHERE section_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "section_name" => $sectionName,
            "semester" => $semester,
            "academic_year" => $academicYear,
            "department_id" => $departmentId,
            "student_capacity" => $studentCapacity,
            "id" => $id,
        ]);

        return $this->getById($id);
    }

    public function delete(int $id): bool
    {
        $sql = "
            DELETE FROM sections
            WHERE section_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        return $stmt->rowCount() > 0;
    }

    private function createSection(array $row): Section
    {
        return new Section(
            (int) $row["section_id"],
            $row["section_name"],
            (int) $row["semester"],
            $row["academic_year"],
            (int) $row["department_id"],
            (int) $row["student_capacity"],
            $row["created_at"],
        );
    }
}
