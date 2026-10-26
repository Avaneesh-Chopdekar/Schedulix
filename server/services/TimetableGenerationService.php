<?php
declare(strict_types=1);

require_once __DIR__ . "/../repositories/TimetableGenerationRepository.php";

class TimetableGenerationService {
    private TimetableGenerationRepository $repo;

    public function __construct(TimetableGenerationRepository $repo) {
        $this->repo = $repo;
    }

    public function getAllGenerations(): array {
        return $this->repo->getAll();
    }

    public function getGeneration(int $id): ?TimetableGeneration {
        return $this->repo->getById($id);
    }

    public function createGeneration(array $data): int {
        if (empty($data['section_id']) || empty($data['semester']) || empty($data['academic_year']) || empty($data['generated_by'])) {
            throw new InvalidArgumentException("Missing required fields: section_id, semester, academic_year, and generated_by are required.");
        }
        return $this->repo->create($data);
    }

    public function generate(array $data): array {
        foreach (['section_id', 'semester', 'academic_year', 'generated_by'] as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                throw new InvalidArgumentException("Missing required field: {$field}.");
            }
        }
        if ((int) $data['section_id'] < 1 || (int) $data['semester'] < 1 ||
            (int) $data['generated_by'] < 1 || !preg_match('/^\d{4}-\d{2}$/', (string) $data['academic_year'])) {
            throw new InvalidArgumentException("Invalid timetable generation parameters.");
        }
        return $this->repo->generate($data);
    }

    public function deleteGeneration(int $id): bool {
        return $this->repo->delete($id);
    }
}