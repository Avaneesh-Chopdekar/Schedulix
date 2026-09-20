<?php

declare(strict_types=1);

class Subject
{
    private int $subjectId;
    private string $subjectCode;
    private string $subjectName;
    private int $semester;
    private int $credits;
    private string $subjectType;
    private int $lecturesPerWeek;
    private string $requiredRoomType;
    private string $createdAt;

    public function __construct(
        int $subjectId,
        string $subjectCode,
        string $subjectName,
        int $semester,
        int $credits,
        string $subjectType,
        int $lecturesPerWeek,
        string $requiredRoomType,
        string $createdAt,
    ) {
        $this->subjectId = $subjectId;
        $this->subjectCode = $subjectCode;
        $this->subjectName = $subjectName;
        $this->semester = $semester;
        $this->credits = $credits;
        $this->subjectType = $subjectType;
        $this->lecturesPerWeek = $lecturesPerWeek;
        $this->requiredRoomType = $requiredRoomType;
        $this->createdAt = $createdAt;
    }

    public function getSubjectId(): int
    {
        return $this->subjectId;
    }

    public function getSubjectCode(): string
    {
        return $this->subjectCode;
    }

    public function getSubjectName(): string
    {
        return $this->subjectName;
    }

    public function getSemester(): int
    {
        return $this->semester;
    }

    public function getCredits(): int
    {
        return $this->credits;
    }

    public function getSubjectType(): string
    {
        return $this->subjectType;
    }

    public function getLecturesPerWeek(): int
    {
        return $this->lecturesPerWeek;
    }

    public function getRequiredRoomType(): string
    {
        return $this->requiredRoomType;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }
}
