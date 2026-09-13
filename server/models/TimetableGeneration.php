<?php
declare(strict_types=1);

class TimetableGeneration {
    private int $generationId;
    private int $sectionId;
    private int $semester;
    private string $academicYear;
    private string $status;
    private ?string $generatedAt;
    private int $generatedBy;

    public function __construct(
        int $generationId,
        int $sectionId,
        int $semester,
        string $academicYear,
        string $status,
        ?string $generatedAt,
        int $generatedBy
    ) {
        $this->generationId = $generationId;
        $this->sectionId = $sectionId;
        $this->semester = $semester;
        $this->academicYear = $academicYear;
        $this->status = $status;
        $this->generatedAt = $generatedAt;
        $this->generatedBy = $generatedBy;
    }

    public function toArray(): array {
        return [
            'generation_id' => $this->generationId,
            'section_id' => $this->sectionId,
            'semester' => $this->semester,
            'academic_year' => $this->academicYear,
            'status' => $this->status,
            'generated_at' => $this->generatedAt,
            'generated_by' => $this->generatedBy
        ];
    }
}