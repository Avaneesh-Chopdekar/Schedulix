<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/StudentRepository.php";

class StudentService
{
    private StudentRepository $studentRepository;

    public function __construct()
    {
        $this->studentRepository = new StudentRepository();
    }

    public function getAllStudents(): array
    {
        return $this->studentRepository->getAll();
    }

    public function getStudent(int $id): Student
    {
        if ($id <= 0) {
            throw new RuntimeException("Invalid student ID");
        }

        $student = $this->studentRepository->getById($id);

        if ($student === null) {
            throw new RuntimeException("Student not found");
        }

        return $student;
    }

    public function getStudentsBySection(int $sectionId): array
    {
        if ($sectionId <= 0) {
            throw new RuntimeException("Invalid section ID");
        }

        return $this->studentRepository->getBySection($sectionId);
    }

    public function createStudent(array $data): Student
    {
        $this->validateData($data);

        $userId = (int) $data["user_id"];

        $rollNumber = trim($data["roll_number"]);

        $sectionId = (int) $data["section_id"];

        $admissionYear = (int) $data["admission_year"];

        $existingUser = $this->studentRepository->getByUserId($userId);

        if ($existingUser !== null) {
            throw new RuntimeException(
                "This user already has a student profile",
            );
        }

        $existingRollNumber = $this->studentRepository->getByRollNumber(
            $rollNumber,
        );

        if ($existingRollNumber !== null) {
            throw new RuntimeException("Roll number already exists");
        }

        return $this->studentRepository->create(
            $userId,
            $rollNumber,
            $sectionId,
            $admissionYear,
        );
    }

    public function updateStudent(int $id, array $data): Student
    {
        $this->getStudent($id);

        $this->validateData($data);

        $userId = (int) $data["user_id"];

        $rollNumber = trim($data["roll_number"]);

        $sectionId = (int) $data["section_id"];

        $admissionYear = (int) $data["admission_year"];

        $existingUser = $this->studentRepository->getByUserId($userId, $id);

        if ($existingUser !== null) {
            throw new RuntimeException(
                "This user already belongs to another student",
            );
        }

        $existingRollNumber = $this->studentRepository->getByRollNumber(
            $rollNumber,
            $id,
        );

        if ($existingRollNumber !== null) {
            throw new RuntimeException(
                "Roll number already belongs to another student",
            );
        }

        $student = $this->studentRepository->update(
            $id,
            $userId,
            $rollNumber,
            $sectionId,
            $admissionYear,
        );

        if ($student === null) {
            throw new RuntimeException("Student could not be updated");
        }

        return $student;
    }

    public function deleteStudent(int $id): void
    {
        $this->getStudent($id);

        try {
            $deleted = $this->studentRepository->delete($id);

            if (!$deleted) {
                throw new RuntimeException("Student could not be deleted");
            }
        } catch (PDOException $e) {
            throw new RuntimeException(
                "Student cannot be deleted because it is being used by another record",
            );
        }
    }

    private function validateData(array $data): void
    {
        $requiredFields = [
            "user_id",
            "roll_number",
            "section_id",
            "admission_year",
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
            !is_numeric($data["section_id"]) ||
            (int) $data["section_id"] <= 0
        ) {
            throw new RuntimeException("Section ID must be a positive integer");
        }

        $rollNumber = trim($data["roll_number"]);

        if ($rollNumber === "") {
            throw new RuntimeException("Roll number cannot be empty");
        }

        if (strlen($rollNumber) > 25) {
            throw new RuntimeException(
                "Roll number cannot exceed 25 characters",
            );
        }

        if (
            !is_numeric($data["admission_year"]) ||
            (int) $data["admission_year"] < 2000 ||
            (int) $data["admission_year"] > 2100
        ) {
            throw new RuntimeException("Invalid admission year");
        }
    }
}
