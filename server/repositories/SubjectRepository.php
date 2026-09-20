<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/Subject.php";

class SubjectRepository
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
                subject_id,
                subject_code,
                subject_name,
                semester,
                credits,
                subject_type,
                lectures_per_week,
                required_room_type,
                created_at
            FROM subjects
            ORDER BY
                semester ASC,
                subject_code ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        $subjects = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $subjects[] = $this->createSubject($row);
        }

        return $subjects;
    }

    public function getById(int $id): ?Subject
    {
        $sql = "
            SELECT
                subject_id,
                subject_code,
                subject_name,
                semester,
                credits,
                subject_type,
                lectures_per_week,
                required_room_type,
                created_at
            FROM subjects
            WHERE subject_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createSubject($row);
    }

    public function getByCode(
        string $subjectCode,
        ?int $excludeId = null,
    ): ?Subject {
        if ($excludeId === null) {
            $sql = "
                SELECT
                    subject_id,
                    subject_code,
                    subject_name,
                    semester,
                    credits,
                    subject_type,
                    lectures_per_week,
                    required_room_type,
                    created_at
                FROM subjects
                WHERE subject_code = :subject_code
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "subject_code" => $subjectCode,
            ]);
        } else {
            $sql = "
                SELECT
                    subject_id,
                    subject_code,
                    subject_name,
                    semester,
                    credits,
                    subject_type,
                    lectures_per_week,
                    required_room_type,
                    created_at
                FROM subjects
                WHERE subject_code = :subject_code
                AND subject_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "subject_code" => $subjectCode,
                "id" => $excludeId,
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createSubject($row);
    }

    public function getBySemester(int $semester): array
    {
        $sql = "
            SELECT
                subject_id,
                subject_code,
                subject_name,
                semester,
                credits,
                subject_type,
                lectures_per_week,
                required_room_type,
                created_at
            FROM subjects
            WHERE semester = :semester
            ORDER BY subject_code ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "semester" => $semester,
        ]);

        $subjects = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $subjects[] = $this->createSubject($row);
        }

        return $subjects;
    }

    public function getByType(string $subjectType): array
    {
        $sql = "
            SELECT
                subject_id,
                subject_code,
                subject_name,
                semester,
                credits,
                subject_type,
                lectures_per_week,
                required_room_type,
                created_at
            FROM subjects
            WHERE subject_type = :subject_type
            ORDER BY
                semester ASC,
                subject_code ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "subject_type" => $subjectType,
        ]);

        $subjects = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $subjects[] = $this->createSubject($row);
        }

        return $subjects;
    }

    public function create(
        string $subjectCode,
        string $subjectName,
        int $semester,
        int $credits,
        string $subjectType,
        int $lecturesPerWeek,
        string $requiredRoomType,
    ): Subject {
        $sql = "
            INSERT INTO subjects
            (
                subject_code,
                subject_name,
                semester,
                credits,
                subject_type,
                lectures_per_week,
                required_room_type
            )
            VALUES
            (
                :subject_code,
                :subject_name,
                :semester,
                :credits,
                :subject_type,
                :lectures_per_week,
                :required_room_type
            )
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "subject_code" => $subjectCode,
            "subject_name" => $subjectName,
            "semester" => $semester,
            "credits" => $credits,
            "subject_type" => $subjectType,
            "lectures_per_week" => $lecturesPerWeek,
            "required_room_type" => $requiredRoomType,
        ]);

        return $this->getById((int) $this->connection->lastInsertId());
    }

    public function update(
        int $id,
        string $subjectCode,
        string $subjectName,
        int $semester,
        int $credits,
        string $subjectType,
        int $lecturesPerWeek,
        string $requiredRoomType,
    ): ?Subject {
        $sql = "
            UPDATE subjects
            SET
                subject_code = :subject_code,
                subject_name = :subject_name,
                semester = :semester,
                credits = :credits,
                subject_type = :subject_type,
                lectures_per_week = :lectures_per_week,
                required_room_type = :required_room_type
            WHERE subject_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "subject_code" => $subjectCode,
            "subject_name" => $subjectName,
            "semester" => $semester,
            "credits" => $credits,
            "subject_type" => $subjectType,
            "lectures_per_week" => $lecturesPerWeek,
            "required_room_type" => $requiredRoomType,
            "id" => $id,
        ]);

        return $this->getById($id);
    }

    public function delete(int $id): bool
    {
        $sql = "
            DELETE FROM subjects
            WHERE subject_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        return $stmt->rowCount() > 0;
    }

    private function createSubject(array $row): Subject
    {
        return new Subject(
            (int) $row["subject_id"],
            $row["subject_code"],
            $row["subject_name"],
            (int) $row["semester"],
            (int) $row["credits"],
            $row["subject_type"],
            (int) $row["lectures_per_week"],
            $row["required_room_type"],
            $row["created_at"],
        );
    }
}
