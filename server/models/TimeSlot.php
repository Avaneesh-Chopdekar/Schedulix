<?php

declare(strict_types=1);

class TimeSlot
{
    private int $timeSlotId;
    private string $day;
    private int $slotNumber;
    private string $startTime;
    private string $endTime;
    private bool $isBreak;
    private string $createdAt;

    public function __construct(
        int $timeSlotId,
        string $day,
        int $slotNumber,
        string $startTime,
        string $endTime,
        bool $isBreak,
        string $createdAt
    ) {
        $this->timeSlotId = $timeSlotId;
        $this->day = $day;
        $this->slotNumber = $slotNumber;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
        $this->isBreak = $isBreak;
        $this->createdAt = $createdAt;
    }

    public function getTimeSlotId(): int
    {
        return $this->timeSlotId;
    }

    public function getDay(): string
    {
        return $this->day;
    }

    public function getSlotNumber(): int
    {
        return $this->slotNumber;
    }

    public function getStartTime(): string
    {
        return $this->startTime;
    }

    public function getEndTime(): string
    {
        return $this->endTime;
    }

    public function getIsBreak(): bool
    {
        return $this->isBreak;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }
}