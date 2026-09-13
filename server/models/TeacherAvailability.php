<?php

declare(strict_types=1);

class TeacherAvailability
{
    private int $availabilityId;
    private int $teacherId;
    private int $timeSlotId;
    private string $day;
    private bool $isAvailable;
    private string $createdAt;

    public function __construct(
        int $availabilityId,
        int $teacherId,
        int $timeSlotId,
        string $day,
        bool $isAvailable,
        string $createdAt
    ) {
        $this->availabilityId = $availabilityId;
        $this->teacherId = $teacherId;
        $this->timeSlotId = $timeSlotId;
        $this->day = $day;
        $this->isAvailable = $isAvailable;
        $this->createdAt = $createdAt;
    }

    public function getAvailabilityId(): int
    {
        return $this->availabilityId;
    }

    public function getTeacherId(): int
    {
        return $this->teacherId;
    }

    public function getTimeSlotId(): int
    {
        return $this->timeSlotId;
    }

    public function getDay(): string
    {
        return $this->day;
    }

    public function getIsAvailable(): bool
    {
        return $this->isAvailable;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }
}