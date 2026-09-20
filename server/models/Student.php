<?php

declare(strict_types=1);

class Student
{
    private int $studentId;
    private int $userId;
    private string $rollNumber;
    private int $sectionId;
    private int $admissionYear;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(
        int $studentId,
        int $userId,
        string $rollNumber,
        int $sectionId,
        int $admissionYear,
        string $createdAt,
        string $updatedAt,
    ) {
        $this->studentId = $studentId;
        $this->userId = $userId;
        $this->rollNumber = $rollNumber;
        $this->sectionId = $sectionId;
        $this->admissionYear = $admissionYear;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getStudentId(): int
    {
        return $this->studentId;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getRollNumber(): string
    {
        return $this->rollNumber;
    }

    public function getSectionId(): int
    {
        return $this->sectionId;
    }

    public function getAdmissionYear(): int
    {
        return $this->admissionYear;
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
