<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/TeacherRepository.php";

class TeacherService
{
    private TeacherRepository $teacherRepository;

    public function __construct()
    {
        $this->teacherRepository = new TeacherRepository();
    }

    public function getAllTeachers(): array
    {
        return $this->teacherRepository->getAll();
    }

    public function getTeacher(int $id): Teacher
    {
        if ($id <= 0) {
            throw new RuntimeException("Invalid teacher ID");
        }

        $teacher = $this->teacherRepository->getById($id);

        if ($teacher === null) {
            throw new RuntimeException("Teacher not found");
        }

        return $teacher;
    }

    public function getTeachersByDepartment(int $departmentId): array
    {
        if ($departmentId <= 0) {
            throw new RuntimeException("Invalid department ID");
        }

        return $this->teacherRepository->getByDepartment($departmentId);
    }

    public function createTeacher(array $data): Teacher
    {
        $this->validateData($data);

        $userId = (int) $data["user_id"];
        $departmentId = (int) $data["department_id"];

        $employeeId = trim($data["employee_id"]);

        $designation = trim($data["designation"]);

        $employmentType = trim($data["employment_type"]);

        $existingUser = $this->teacherRepository->getByUserId($userId);

        if ($existingUser !== null) {
            throw new RuntimeException(
                "This user already has a teacher profile",
            );
        }

        $existingEmployee = $this->teacherRepository->getByEmployeeId(
            $employeeId,
        );

        if ($existingEmployee !== null) {
            throw new RuntimeException("Employee ID already exists");
        }

        return $this->teacherRepository->create(
            $userId,
            $departmentId,
            $employeeId,
            $designation,
            $employmentType,
        );
    }

    public function updateTeacher(int $id, array $data): Teacher
    {
        $this->getTeacher($id);

        $this->validateData($data);

        $userId = (int) $data["user_id"];
        $departmentId = (int) $data["department_id"];

        $employeeId = trim($data["employee_id"]);

        $designation = trim($data["designation"]);

        $employmentType = trim($data["employment_type"]);

        $existingUser = $this->teacherRepository->getByUserId($userId, $id);

        if ($existingUser !== null) {
            throw new RuntimeException(
                "This user already belongs to another teacher",
            );
        }

        $existingEmployee = $this->teacherRepository->getByEmployeeId(
            $employeeId,
            $id,
        );

        if ($existingEmployee !== null) {
            throw new RuntimeException(
                "Employee ID already belongs to another teacher",
            );
        }

        $teacher = $this->teacherRepository->update(
            $id,
            $userId,
            $departmentId,
            $employeeId,
            $designation,
            $employmentType,
        );

        if ($teacher === null) {
            throw new RuntimeException("Teacher could not be updated");
        }

        return $teacher;
    }

    public function deleteTeacher(int $id): void
    {
        $this->getTeacher($id);

        try {
            $deleted = $this->teacherRepository->delete($id);

            if (!$deleted) {
                throw new RuntimeException("Teacher could not be deleted");
            }
        } catch (PDOException $e) {
            throw new RuntimeException(
                "Teacher cannot be deleted because it is being used by another record",
            );
        }
    }

    private function validateData(array $data): void
    {
        $requiredFields = [
            "user_id",
            "department_id",
            "employee_id",
            "designation",
            "employment_type",
        ];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === "") {
                throw new RuntimeException("$field is required");
            }
        }

        if (!is_numeric($data["user_id"]) || (int) $data["user_id"] <= 0) {
            throw new RuntimeException("User ID must be a positive integer");
        }

        if (
            !is_numeric($data["department_id"]) ||
            (int) $data["department_id"] <= 0
        ) {
            throw new RuntimeException(
                "Department ID must be a positive integer",
            );
        }

        $employeeId = trim($data["employee_id"]);

        if (strlen($employeeId) > 20) {
            throw new RuntimeException(
                "Employee ID cannot exceed 20 characters",
            );
        }

        $designation = trim($data["designation"]);

        if (strlen($designation) > 50) {
            throw new RuntimeException(
                "Designation cannot exceed 50 characters",
            );
        }

        $employmentType = trim($data["employment_type"]);

        if (strlen($employmentType) > 20) {
            throw new RuntimeException(
                "Employment type cannot exceed 20 characters",
            );
        }
    }
}
