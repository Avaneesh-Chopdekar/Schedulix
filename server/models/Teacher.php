<?php

declare(strict_types=1);

class Teacher
{
    private int $teacherId;
    private int $userId;
    private int $departmentId;
    private string $employeeId;
    private string $designation;
    private string $employmentType;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(
        int $teacherId,
        int $userId,
        int $departmentId,
        string $employeeId,
        string $designation,
        string $employmentType,
        string $createdAt,
        string $updatedAt,
    ) {
        $this->teacherId = $teacherId;
        $this->userId = $userId;
        $this->departmentId = $departmentId;
        $this->employeeId = $employeeId;
        $this->designation = $designation;
        $this->employmentType = $employmentType;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getTeacherId(): int
    {
        return $this->teacherId;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getDepartmentId(): int
    {
        return $this->departmentId;
    }

    public function getEmployeeId(): string
    {
        return $this->employeeId;
    }

    public function getDesignation(): string
    {
        return $this->designation;
    }

    public function getEmploymentType(): string
    {
        return $this->employmentType;
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
