<?php

declare(strict_types=1);

class Classroom
{
    private int $classroomId;
    private string $roomNumber;
    private string $building;
    private int $floor;
    private int $capacity;
    private string $roomType;
    private string $status;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(
        int $classroomId,
        string $roomNumber,
        string $building,
        int $floor,
        int $capacity,
        string $roomType,
        string $status,
        string $createdAt,
        string $updatedAt
    ) {
        $this->classroomId = $classroomId;
        $this->roomNumber = $roomNumber;
        $this->building = $building;
        $this->floor = $floor;
        $this->capacity = $capacity;
        $this->roomType = $roomType;
        $this->status = $status;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getClassroomId(): int
    {
        return $this->classroomId;
    }

    public function getRoomNumber(): string
    {
        return $this->roomNumber;
    }

    public function getBuilding(): string
    {
        return $this->building;
    }

    public function getFloor(): int
    {
        return $this->floor;
    }

    public function getCapacity(): int
    {
        return $this->capacity;
    }

    public function getRoomType(): string
    {
        return $this->roomType;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }
}