<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/TimeSlotRepository.php";

class TimeSlotService
{
    private TimeSlotRepository $timeSlotRepository;

    public function __construct()
    {
        $this->timeSlotRepository = new TimeSlotRepository();
    }

    public function getAllTimeSlots(): array
    {
        return $this->timeSlotRepository->getAll();
    }

    public function getTimeSlot(int $id): TimeSlot
    {
        if ($id <= 0) {
            throw new RuntimeException(
                "Invalid time slot ID"
            );
        }

        $timeSlot = $this->timeSlotRepository->getById($id);

        if ($timeSlot === null) {
            throw new RuntimeException(
                "Time slot not found"
            );
        }

        return $timeSlot;
    }

    public function createTimeSlot(array $data): TimeSlot
    {
        $this->validateData($data);

        $day = strtoupper(trim($data["day"]));
        $slotNumber = (int) $data["slot_number"];

        $existing =
            $this->timeSlotRepository->getByDayAndSlot(
                $day,
                $slotNumber
            );

        if ($existing !== null) {
            throw new RuntimeException(
                "This day and slot number combination already exists"
            );
        }

        return $this->timeSlotRepository->create(
            $day,
            $slotNumber,
            $data["start_time"],
            $data["end_time"],
            $this->toBoolean($data["is_break"] ?? false)
        );
    }

    public function updateTimeSlot(
        int $id,
        array $data
    ): TimeSlot {

        $this->getTimeSlot($id);

        $this->validateData($data);

        $day = strtoupper(trim($data["day"]));
        $slotNumber = (int) $data["slot_number"];

        $existing =
            $this->timeSlotRepository->getByDayAndSlot(
                $day,
                $slotNumber,
                $id
            );

        if ($existing !== null) {
            throw new RuntimeException(
                "Another time slot already uses this day and slot number"
            );
        }

        $timeSlot =
            $this->timeSlotRepository->update(
                $id,
                $day,
                $slotNumber,
                $data["start_time"],
                $data["end_time"],
                $this->toBoolean($data["is_break"] ?? false)
            );

        if ($timeSlot === null) {
            throw new RuntimeException(
                "Time slot could not be updated"
            );
        }

        return $timeSlot;
    }

    public function deleteTimeSlot(int $id): void
    {
        $this->getTimeSlot($id);

        try {

            $deleted =
                $this->timeSlotRepository->delete($id);

            if (!$deleted) {
                throw new RuntimeException(
                    "Time slot could not be deleted"
                );
            }

        } catch (PDOException $e) {

            throw new RuntimeException(
                "Time slot cannot be deleted because it is being used by another record"
            );
        }
    }

    private function validateData(array $data): void
    {
        $requiredFields = [
            "day",
            "slot_number",
            "start_time",
            "end_time"
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

        if (!in_array($day, $validDays, true)) {
            throw new RuntimeException(
                "Invalid day"
            );
        }

        if (
            !is_numeric($data["slot_number"]) ||
            (int) $data["slot_number"] <= 0
        ) {
            throw new RuntimeException(
                "Slot number must be a positive integer"
            );
        }

        if (!$this->isValidTime($data["start_time"])) {
            throw new RuntimeException(
                "Invalid start time. Use HH:MM:SS format"
            );
        }

        if (!$this->isValidTime($data["end_time"])) {
            throw new RuntimeException(
                "Invalid end time. Use HH:MM:SS format"
            );
        }

        if ($data["start_time"] >= $data["end_time"]) {
            throw new RuntimeException(
                "End time must be after start time"
            );
        }

        if (isset($data["is_break"])) {

            $value = $data["is_break"];

            if (
                !is_bool($value) &&
                !in_array(
                    $value,
                    [0, 1, "0", "1"],
                    true
                )
            ) {
                throw new RuntimeException(
                    "is_break must be true or false"
                );
            }
        }
    }

    private function isValidTime(string $time): bool
    {
        $date = \DateTime::createFromFormat(
            "H:i:s",
            $time
        );

        return $date !== false &&
            $date->format("H:i:s") === $time;
    }

    private function toBoolean(mixed $value): bool
    {
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