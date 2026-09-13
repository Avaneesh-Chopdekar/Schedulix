<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/TimeSlot.php";

class TimeSlotRepository
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
                time_slot_id,
                day,
                slot_number,
                start_time,
                end_time,
                is_break,
                created_at
            FROM time_slots
            ORDER BY
                CASE day
                    WHEN 'MONDAY' THEN 1
                    WHEN 'TUESDAY' THEN 2
                    WHEN 'WEDNESDAY' THEN 3
                    WHEN 'THURSDAY' THEN 4
                    WHEN 'FRIDAY' THEN 5
                    WHEN 'SATURDAY' THEN 6
                    WHEN 'SUNDAY' THEN 7
                    ELSE 8
                END,
                slot_number ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        $timeSlots = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $timeSlots[] = $this->createTimeSlot($row);
        }

        return $timeSlots;
    }

    public function getById(int $id): ?TimeSlot
    {
        $sql = "
            SELECT
                time_slot_id,
                day,
                slot_number,
                start_time,
                end_time,
                is_break,
                created_at
            FROM time_slots
            WHERE time_slot_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createTimeSlot($row);
    }

    public function getByDayAndSlot(
        string $day,
        int $slotNumber,
        ?int $excludeId = null
    ): ?TimeSlot {

        if ($excludeId === null) {

            $sql = "
                SELECT
                    time_slot_id,
                    day,
                    slot_number,
                    start_time,
                    end_time,
                    is_break,
                    created_at
                FROM time_slots
                WHERE day = :day
                AND slot_number = :slot_number
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "day" => $day,
                "slot_number" => $slotNumber
            ]);

        } else {

            $sql = "
                SELECT
                    time_slot_id,
                    day,
                    slot_number,
                    start_time,
                    end_time,
                    is_break,
                    created_at
                FROM time_slots
                WHERE day = :day
                AND slot_number = :slot_number
                AND time_slot_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "day" => $day,
                "slot_number" => $slotNumber,
                "id" => $excludeId
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createTimeSlot($row);
    }

    public function create(
        string $day,
        int $slotNumber,
        string $startTime,
        string $endTime,
        bool $isBreak
    ): TimeSlot {

        $sql = "
            INSERT INTO time_slots
            (
                day,
                slot_number,
                start_time,
                end_time,
                is_break
            )
            VALUES
            (
                :day,
                :slot_number,
                :start_time,
                :end_time,
                :is_break
            )
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "day" => $day,
            "slot_number" => $slotNumber,
            "start_time" => $startTime,
            "end_time" => $endTime,
            "is_break" => $isBreak ? 1 : 0
        ]);

        return $this->getById(
            (int) $this->connection->lastInsertId()
        );
    }

    public function update(
        int $id,
        string $day,
        int $slotNumber,
        string $startTime,
        string $endTime,
        bool $isBreak
    ): ?TimeSlot {

        $sql = "
            UPDATE time_slots
            SET
                day = :day,
                slot_number = :slot_number,
                start_time = :start_time,
                end_time = :end_time,
                is_break = :is_break
            WHERE time_slot_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "day" => $day,
            "slot_number" => $slotNumber,
            "start_time" => $startTime,
            "end_time" => $endTime,
            "is_break" => $isBreak ? 1 : 0,
            "id" => $id
        ]);

        return $this->getById($id);
    }

    public function delete(int $id): bool
    {
        $sql = "
            DELETE FROM time_slots
            WHERE time_slot_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        return $stmt->rowCount() > 0;
    }

    private function createTimeSlot(array $row): TimeSlot
    {
        return new TimeSlot(
            (int) $row["time_slot_id"],
            $row["day"],
            (int) $row["slot_number"],
            $row["start_time"],
            $row["end_time"],
            (bool) $row["is_break"],
            $row["created_at"]
        );
    }
}