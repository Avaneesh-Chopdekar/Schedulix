<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/TeacherAvailability.php";

class TeacherAvailabilityRepository
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
                availability_id,
                teacher_id,
                time_slot_id,
                day,
                is_available,
                created_at
            FROM teacher_availability
            ORDER BY availability_id ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        $availability = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $availability[] = $this->createObject($row);
        }

        return $availability;
    }

    public function getById(int $id): ?TeacherAvailability
    {
        $sql = "
            SELECT
                availability_id,
                teacher_id,
                time_slot_id,
                day,
                is_available,
                created_at
            FROM teacher_availability
            WHERE availability_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createObject($row);
    }

    public function getByTeacherSlotDay(
        int $teacherId,
        int $timeSlotId,
        string $day,
        ?int $excludeId = null
    ): ?TeacherAvailability {

        if ($excludeId === null) {

            $sql = "
                SELECT
                    availability_id,
                    teacher_id,
                    time_slot_id,
                    day,
                    is_available,
                    created_at
                FROM teacher_availability
                WHERE teacher_id = :teacher_id
                AND time_slot_id = :time_slot_id
                AND day = :day
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "teacher_id" => $teacherId,
                "time_slot_id" => $timeSlotId,
                "day" => $day
            ]);

        } else {

            $sql = "
                SELECT
                    availability_id,
                    teacher_id,
                    time_slot_id,
                    day,
                    is_available,
                    created_at
                FROM teacher_availability
                WHERE teacher_id = :teacher_id
                AND time_slot_id = :time_slot_id
                AND day = :day
                AND availability_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "teacher_id" => $teacherId,
                "time_slot_id" => $timeSlotId,
                "day" => $day,
                "id" => $excludeId
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createObject($row);
    }

    public function create(
        int $teacherId,
        int $timeSlotId,
        string $day,
        bool $isAvailable
    ): TeacherAvailability {

        $sql = "
            INSERT INTO teacher_availability
            (
                teacher_id,
                time_slot_id,
                day,
                is_available
            )
            VALUES
            (
                :teacher_id,
                :time_slot_id,
                :day,
                :is_available
            )
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "teacher_id" => $teacherId,
            "time_slot_id" => $timeSlotId,
            "day" => $day,
            "is_available" => $isAvailable ? 1 : 0
        ]);

        $id = (int) $this->connection->lastInsertId();

        return $this->getById($id);
    }

    public function update(
        int $id,
        int $teacherId,
        int $timeSlotId,
        string $day,
        bool $isAvailable
    ): ?TeacherAvailability {

        $sql = "
            UPDATE teacher_availability
            SET
                teacher_id = :teacher_id,
                time_slot_id = :time_slot_id,
                day = :day,
                is_available = :is_available
            WHERE availability_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "teacher_id" => $teacherId,
            "time_slot_id" => $timeSlotId,
            "day" => $day,
            "is_available" => $isAvailable ? 1 : 0,
            "id" => $id
        ]);

        return $this->getById($id);
    }

    public function delete(int $id): bool
    {
        $sql = "
            DELETE FROM teacher_availability
            WHERE availability_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        return $stmt->rowCount() > 0;
    }

    private function createObject(
        array $row
    ): TeacherAvailability {

        return new TeacherAvailability(
            (int) $row["availability_id"],
            (int) $row["teacher_id"],
            (int) $row["time_slot_id"],
            $row["day"],
            (bool) $row["is_available"],
            $row["created_at"]
        );
    }
}