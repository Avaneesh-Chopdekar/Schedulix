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

    public function createGeneration(array $data): int {
        if (empty($data['section_id']) || empty($data['semester']) || empty($data['academic_year']) || empty($data['generated_by'])) {
            throw new InvalidArgumentException("Missing required fields: section_id, semester, academic_year, and generated_by are required.");
        }
        return $this->repo->create($data);
    }

    public function deleteGeneration(int $id): bool {
        return $this->repo->delete($id);
    }
}