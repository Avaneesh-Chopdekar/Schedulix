<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/ClassroomRepository.php";

class ClassroomService
{
    private ClassroomRepository $classroomRepository;

    public function __construct()
    {
        $this->classroomRepository = new ClassroomRepository();
    }

    public function getAllClassrooms(): array
    {
        return $this->classroomRepository->getAll();
    }

    public function getClassroom(int $id): Classroom
    {
        $classroom = $this->classroomRepository->getById($id);

        if ($classroom === null) {
            throw new RuntimeException("Classroom not found");
        }

        return $classroom;
    }

    public function createClassroom(array $data): Classroom
    {
        $this->validateData($data);

        $roomNumber = trim($data["room_number"]);

        $existing = $this->classroomRepository->getByRoomNumber(
            $roomNumber
        );

        if ($existing !== null) {
            throw new RuntimeException(
                "Room number already exists"
            );
        }

        return $this->classroomRepository->create(
            $roomNumber,
            trim($data["building"]),
            (int) $data["floor"],
            (int) $data["capacity"],
            $data["room_type"],
            $data["status"] ?? "AVAILABLE"
        );
    }

    public function updateClassroom(
        int $id,
        array $data
    ): Classroom {

        $this->getClassroom($id);

        $this->validateData($data);

        $roomNumber = trim($data["room_number"]);

        $existing = $this->classroomRepository->getByRoomNumber(
            $roomNumber,
            $id
        );

        if ($existing !== null) {
            throw new RuntimeException(
                "Another classroom already uses this room number"
            );
        }

        return $this->classroomRepository->update(
            $id,
            $roomNumber,
            trim($data["building"]),
            (int) $data["floor"],
            (int) $data["capacity"],
            $data["room_type"],
            $data["status"]
        );
    }

    public function deleteClassroom(int $id): void
    {
        $this->getClassroom($id);

        try {

            $deleted = $this->classroomRepository->delete($id);

            if (!$deleted) {
                throw new RuntimeException(
                    "Classroom could not be deleted"
                );
            }

        } catch (PDOException $e) {

            throw new RuntimeException(
                "Classroom cannot be deleted because it is being used by another record"
            );
        }
    }

    private function validateData(array $data): void
    {
        $requiredFields = [
            "room_number",
            "building",
            "floor",
            "capacity",
            "room_type"
        ];

        foreach ($requiredFields as $field) {

            if (
                !isset($data[$field]) ||
                $data[$field] === ""
            ) {
                throw new RuntimeException(
                    "$field is required"
                );
            }
        }

        if (strlen(trim($data["room_number"])) > 10) {
            throw new RuntimeException(
                "Room number cannot exceed 10 characters"
            );
        }

        if (strlen(trim($data["building"])) > 50) {
            throw new RuntimeException(
                "Building cannot exceed 50 characters"
            );
        }

        if (!is_numeric($data["floor"])) {
            throw new RuntimeException(
                "Floor must be a number"
            );
        }

        if ((int) $data["floor"] < 0) {
            throw new RuntimeException(
                "Floor cannot be negative"
            );
        }

        if (!is_numeric($data["capacity"])) {
            throw new RuntimeException(
                "Capacity must be a number"
            );
        }

        if ((int) $data["capacity"] <= 0) {
            throw new RuntimeException(
                "Capacity must be greater than zero"
            );
        }

        $validRoomTypes = [
            "CLASSROOM",
            "LAB",
            "SEMINAR"
        ];

        if (!in_array(
            $data["room_type"],
            $validRoomTypes,
            true
        )) {
            throw new RuntimeException(
                "Invalid room type"
            );
        }

        $status = $data["status"] ?? "AVAILABLE";

        $validStatuses = [
            "AVAILABLE",
            "OCCUPIED"
        ];

        if (!in_array(
            $status,
            $validStatuses,
            true
        )) {
            throw new RuntimeException(
                "Invalid classroom status"
            );
        }
    }
}