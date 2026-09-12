<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/DepartmentRepository.php";

class DepartmentService
{
    private DepartmentRepository $departmentRepository;

    public function __construct()
    {
        $this->departmentRepository = new DepartmentRepository();
    }

    public function getAllDepartments(): array
    {
        return $this->departmentRepository->findAll();
    }

    public function getDepartment(int $departmentId): Department
    {
        $department = $this->departmentRepository->findById($departmentId);

        if ($department === null) {
            throw new RuntimeException("Department not found");
        }

        return $department;
    }
}
