<?php

declare(strict_types=1);

class SubjectSection
{
    private int $subjectSectionId;
    private int $subjectId;
    private int $sectionId;
    private string $createdAt;

    public function __construct(
        int $subjectSectionId,
        int $subjectId,
        int $sectionId,
        string $createdAt,
    ) {
        $this->subjectSectionId = $subjectSectionId;
        $this->subjectId = $subjectId;
        $this->sectionId = $sectionId;
        $this->createdAt = $createdAt;
    }

    public function getSubjectSectionId(): int
    {
        return $this->subjectSectionId;
    }

    public function getSubjectId(): int
    {
        return $this->subjectId;
    }

    public function getSectionId(): int
    {
        return $this->sectionId;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }
}
