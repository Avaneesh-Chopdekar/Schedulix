<?php
declare(strict_types=1);

require_once __DIR__ . "/../repositories/SchedulingConstraintRepository.php";

class SchedulingConstraintService {
    private SchedulingConstraintRepository $repo;

    public function __construct(SchedulingConstraintRepository $repo) {
        $this->repo = $repo;
    }

    public function getAllConstraints(): array {
        return $this->repo->getAll();
    }

    // Fulfills your Validation responsibility
    public function validateCreationData(array $data): void {
        $validTypes = [
            'TEACHER_UNAVAILABLE', 'ROOM_CAPACITY', 'ROOM_TYPE', 
            'TEACHER_CONFLICT', 'SECTION_CONFLICT', 'MAX_LECTURES', 
            'CONSECUTIVE_LECTURES', 'OTHER'
        ];

        if (empty($data['constraint_type']) || !in_array($data['constraint_type'], $validTypes)) {
            throw new InvalidArgumentException("Invalid or missing constraint_type.");
        }

        if (empty($data['constraint_name']) || strlen($data['constraint_name']) > 100) {
            throw new InvalidArgumentException("Constraint name is required and must be under 100 characters.");
        }
    }

    public function updateConstraint(int $id, array $data): bool {
        // Re-use the exact same validation rules for updates
        $this->validateCreationData($data);
        return $this->repo->update($id, $data);
    }

    public function deleteConstraint(int $id): bool {
        return $this->repo->delete($id);
    }
}
