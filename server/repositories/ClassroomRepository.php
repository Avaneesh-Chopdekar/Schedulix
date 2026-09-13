<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/Classroom.php";

class ClassroomRepository
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
                classroom_id,
                room_number,
                building,
                floor,
                capacity,
                room_type,
                status,
                created_at,
                updated_at
            FROM classrooms
            ORDER BY classroom_id ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        $classrooms = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $classrooms[] = $this->createClassroom($row);
        }

        return $classrooms;
    }

    public function getById(int $id): ?Classroom
    {
        $sql = "
            SELECT
                classroom_id,
                room_number,
                building,
                floor,
                capacity,
                room_type,
                status,
                created_at,
                updated_at
            FROM classrooms
            WHERE classroom_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createClassroom($row);
    }

    public function getByRoomNumber(
        string $roomNumber,
        ?int $excludeId = null
    ): ?Classroom {

        if ($excludeId === null) {

            $sql = "
                SELECT
                    classroom_id,
                    room_number,
                    building,
                    floor,
                    capacity,
                    room_type,
                    status,
                    created_at,
                    updated_at
                FROM classrooms
                WHERE room_number = :room_number
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "room_number" => $roomNumber
            ]);

        } else {

            $sql = "
                SELECT
                    classroom_id,
                    room_number,
                    building,
                    floor,
                    capacity,
                    room_type,
                    status,
                    created_at,
                    updated_at
                FROM classrooms
                WHERE room_number = :room_number
                AND classroom_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "room_number" => $roomNumber,
                "id" => $excludeId
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createClassroom($row);
    }

    public function create(
        string $roomNumber,
        string $building,
        int $floor,
        int $capacity,
        string $roomType,
        string $status
    ): Classroom {

        $sql = "
            INSERT INTO classrooms
            (
                room_number,
                building,
                floor,
                capacity,
                room_type,
                status
            )
            VALUES
            (
                :room_number,
                :building,
                :floor,
                :capacity,
                :room_type,
                :status
            )
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "room_number" => $roomNumber,
            "building" => $building,
            "floor" => $floor,
            "capacity" => $capacity,
            "room_type" => $roomType,
            "status" => $status
        ]);

        return $this->getById(
            (int) $this->connection->lastInsertId()
        );
    }

    public function update(
        int $id,
        string $roomNumber,
        string $building,
        int $floor,
        int $capacity,
        string $roomType,
        string $status
    ): ?Classroom {

        $sql = "
            UPDATE classrooms
            SET
                room_number = :room_number,
                building = :building,
                floor = :floor,
                capacity = :capacity,
                room_type = :room_type,
                status = :status
            WHERE classroom_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "room_number" => $roomNumber,
            "building" => $building,
            "floor" => $floor,
            "capacity" => $capacity,
            "room_type" => $roomType,
            "status" => $status,
            "id" => $id
        ]);

        return $this->getById($id);
    }

    public function delete(int $id): bool
    {
        $sql = "
            DELETE FROM classrooms
            WHERE classroom_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        return $stmt->rowCount() > 0;
    }

    private function createClassroom(array $row): Classroom
    {
        return new Classroom(
            (int) $row["classroom_id"],
            $row["room_number"],
            $row["building"],
            (int) $row["floor"],
            (int) $row["capacity"],
            $row["room_type"],
            $row["status"],
            $row["created_at"],
            $row["updated_at"]
        );
    }
}