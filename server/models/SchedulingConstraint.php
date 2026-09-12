<?php
declare(strict_types=1);

class SchedulingConstraint {
    private int $constraintId;
    private string $constraintType;
    private string $constraintName;
    private ?string $description;
    private bool $isHardConstraint;
    private bool $isActive;
    private int $priority;

    public function __construct(
        int $constraintId, 
        string $constraintType, 
        string $constraintName, 
        ?string $description, 
        bool $isHardConstraint, 
        bool $isActive, 
        int $priority
    ) {
        $this->constraintId = $constraintId;
        $this->constraintType = $constraintType;
        $this->constraintName = $constraintName;
        $this->description = $description;
        $this->isHardConstraint = $isHardConstraint;
        $this->isActive = $isActive;
        $this->priority = $priority;
    }

    public function toArray(): array {
        return [
            'constraint_id' => $this->constraintId,
            'constraint_type' => $this->constraintType,
            'constraint_name' => $this->constraintName,
            'description' => $this->description,
            'is_hard_constraint' => $this->isHardConstraint,
            'is_active' => $this->isActive,
            'priority' => $this->priority
        ];
    }
}