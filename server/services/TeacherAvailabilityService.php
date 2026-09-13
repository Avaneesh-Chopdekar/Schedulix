<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/TeacherAvailabilityRepository.php";

class TeacherAvailabilityService
{
    private TeacherAvailabilityRepository $repository;

    public function __construct()
    {
        $this->repository =
            new TeacherAvailabilityRepository();
    }

    public function getAll(): array
    {
        return $this->repository->getAll();
    }

    public function getById(
        int $id
    ): TeacherAvailability {

        if ($id <= 0) {
            throw new RuntimeException(
                "Invalid availability ID"
            );
        }

        $availability =
            $this->repository->getById($id);

        if ($availability === null) {
            throw new RuntimeException(
                "Teacher availability not found"
            );
        }

        return $availability;
    }

    public function create(
        array $data
    ): TeacherAvailability {

        $this->validateData($data);

        $teacherId = (int) $data["teacher_id"];
        $timeSlotId = (int) $data["time_slot_id"];

        $day = strtoupper(
            trim($data["day"])
        );

        $isAvailable =
            $this->toBoolean(
                $data["is_available"]
            );

        $existing =
            $this->repository->getByTeacherSlotDay(
                $teacherId,
                $timeSlotId,
                $day
            );

        if ($existing !== null) {
            throw new RuntimeException(
                "Availability record already exists for this teacher, time slot and day"
            );
        }

        return $this->repository->create(
            $teacherId,
            $timeSlotId,
            $day,
            $isAvailable
        );
    }

    public function update(
        int $id,
        array $data
    ): TeacherAvailability {

        $this->getById($id);

        $this->validateData($data);

        $teacherId = (int) $data["teacher_id"];
        $timeSlotId = (int) $data["time_slot_id"];

        $day = strtoupper(
            trim($data["day"])
        );

        $isAvailable =
            $this->toBoolean(
                $data["is_available"]
            );

        $existing =
            $this->repository->getByTeacherSlotDay(
                $teacherId,
                $timeSlotId,
                $day,
                $id
            );

        if ($existing !== null) {
            throw new RuntimeException(
                "Another availability record already exists for this teacher, time slot and day"
            );
        }

        $result =
            $this->repository->update(
                $id,
                $teacherId,
                $timeSlotId,
                $day,
                $isAvailable
            );

        if ($result === null) {
            throw new RuntimeException(
                "Availability record could not be updated"
            );
        }

        return $result;
    }

    public function delete(int $id): void
    {
        $this->getById($id);

        $deleted =
            $this->repository->delete($id);

        if (!$deleted) {
            throw new RuntimeException(
                "Availability record could not be deleted"
            );
        }
    }

    private function validateData(
        array $data
    ): void {

        $requiredFields = [
            "teacher_id",
            "time_slot_id",
            "day",
            "is_available"
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

        if (
            !is_numeric($data["teacher_id"]) ||
            (int) $data["teacher_id"] <= 0
        ) {
            throw new RuntimeException(
                "teacher_id must be a positive integer"
            );
        }

        if (
            !is_numeric($data["time_slot_id"]) ||
            (int) $data["time_slot_id"] <= 0
        ) {
            throw new RuntimeException(
                "time_slot_id must be a positive integer"
            );
        }

        $validDays = [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY"
        ];

        $day = strtoupper(
            trim($data["day"])
        );

        if (!in_array(
            $day,
            $validDays,
            true
        )) {
            throw new RuntimeException(
                "Invalid day"
            );
        }

        if (
            !is_bool($data["is_available"]) &&
            !in_array(
                $data["is_available"],
                [0, 1, "0", "1", true, false],
                true
            )
        ) {
            throw new RuntimeException(
                "is_available must be true or false"
            );
        }
    }

    private function toBoolean(
        mixed $value
    ): bool {

        if (is_bool($value)) {
            return $value;
        }

        return in_array(
            $value,
            [1, "1", true],
            true
        );
    }
}