<?php

declare(strict_types=1);

class Department
{
    public function __construct(
        private int $departmentId,
        private string $departmentName,
        private string $createdAt,
    ) {}

    public function getDepartmentId(): int
    {
        return $this->departmentId;
    }

    public function getDepartmentName(): string
    {
        return $this->departmentName;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function setDepartmentName(string $departmentName): void
    {
        $this->departmentName = $departmentName;
    }
}
