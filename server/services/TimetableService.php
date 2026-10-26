<?php
declare(strict_types=1);

require_once __DIR__ . "/../repositories/TimetableRepository.php";

class TimetableService {
    private TimetableRepository $repo;

    public function __construct(TimetableRepository $repo) {
        $this->repo = $repo;
    }

    public function getAllSlots(?int $generationId = null): array {
        return $this->repo->getAll($generationId);
    }

    public function getSlotsByGeneration(int $generationId): array {
        return $this->repo->getByGeneration($generationId);
    }

    public function validateData(array $data): void {
        $required = ['generation_id', 'subject_id', 'teacher_id', 'classroom_id', 'time_slot_id', 'section_id'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }
    }

    public function createSlot(array $data): int {
        $this->validateData($data);
        return $this->repo->create($data);
    }

    public function updateSlot(int $id, array $data): bool {
        $this->validateData($data);
        return $this->repo->update($id, $data);
    }

    public function getChanges(?int $generationId = null): array {
        return $this->repo->getChanges($generationId);
    }

    public function deleteSlot(int $id): bool {
        return $this->repo->delete($id);
    }
}