<?php

declare(strict_types=1);

class Section
{
    private int $sectionId;
    private string $sectionName;
    private int $semester;
    private string $academicYear;
    private int $departmentId;
    private int $studentCapacity;
    private string $createdAt;

    public function __construct(
        int $sectionId,
        string $sectionName,
        int $semester,
        string $academicYear,
        int $departmentId,
        int $studentCapacity,
        string $createdAt,
    ) {
        $this->sectionId = $sectionId;
        $this->sectionName = $sectionName;
        $this->semester = $semester;
        $this->academicYear = $academicYear;
        $this->departmentId = $departmentId;
        $this->studentCapacity = $studentCapacity;
        $this->createdAt = $createdAt;
    }

    public function getSectionId(): int
    {
        return $this->sectionId;
    }

    public function getSectionName(): string
    {
        return $this->sectionName;
    }

    public function getSemester(): int
    {
        return $this->semester;
    }

    public function getAcademicYear(): string
    {
        return $this->academicYear;
    }

    public function getDepartmentId(): int
    {
        return $this->departmentId;
    }

    public function getStudentCapacity(): int
    {
        return $this->studentCapacity;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }
}
