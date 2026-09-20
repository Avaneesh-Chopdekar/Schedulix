<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/SectionRepository.php";

class SectionService
{
    private SectionRepository $sectionRepository;

    public function __construct()
    {
        $this->sectionRepository = new SectionRepository();
    }

    public function getAllSections(): array
    {
        return $this->sectionRepository->getAll();
    }

    public function getSection(int $id): Section
    {
        if ($id <= 0) {
            throw new RuntimeException("Invalid section ID");
        }

        $section = $this->sectionRepository->getById($id);

        if ($section === null) {
            throw new RuntimeException("Section not found");
        }

        return $section;
    }

    public function getSectionsByDepartment(int $departmentId): array
    {
        if ($departmentId <= 0) {
            throw new RuntimeException("Invalid department ID");
        }

        return $this->sectionRepository->getByDepartment($departmentId);
    }

    public function getSectionsBySemester(int $semester): array
    {
        if ($semester < 1 || $semester > 8) {
            throw new RuntimeException("Semester must be between 1 and 8");
        }

        return $this->sectionRepository->getBySemester($semester);
    }

    public function getSectionsByAcademicYear(string $academicYear): array
    {
        $academicYear = trim($academicYear);

        if ($academicYear === "") {
            throw new RuntimeException("Academic year is required");
        }

        return $this->sectionRepository->getByAcademicYear($academicYear);
    }

    public function createSection(array $data): Section
    {
        $this->validateData($data);

        $sectionName = strtoupper(trim($data["section_name"]));

        $semester = (int) $data["semester"];

        $academicYear = trim($data["academic_year"]);

        $departmentId = (int) $data["department_id"];

        $studentCapacity = (int) $data["student_capacity"];

        $existing = $this->sectionRepository->getByDetails(
            $sectionName,
            $semester,
            $academicYear,
            $departmentId,
        );

        if ($existing !== null) {
            throw new RuntimeException(
                "This section already exists for the department, semester and academic year",
            );
        }

        return $this->sectionRepository->create(
            $sectionName,
            $semester,
            $academicYear,
            $departmentId,
            $studentCapacity,
        );
    }

    public function updateSection(int $id, array $data): Section
    {
        $this->getSection($id);

        $this->validateData($data);

        $sectionName = strtoupper(trim($data["section_name"]));

        $semester = (int) $data["semester"];

        $academicYear = trim($data["academic_year"]);

        $departmentId = (int) $data["department_id"];

        $studentCapacity = (int) $data["student_capacity"];

        $existing = $this->sectionRepository->getByDetails(
            $sectionName,
            $semester,
            $academicYear,
            $departmentId,
            $id,
        );

        if ($existing !== null) {
            throw new RuntimeException(
                "Another section already uses these details",
            );
        }

        $section = $this->sectionRepository->update(
            $id,
            $sectionName,
            $semester,
            $academicYear,
            $departmentId,
            $studentCapacity,
        );

        if ($section === null) {
            throw new RuntimeException("Section could not be updated");
        }

        return $section;
    }

    public function deleteSection(int $id): void
    {
        $this->getSection($id);

        try {
            $deleted = $this->sectionRepository->delete($id);

            if (!$deleted) {
                throw new RuntimeException("Section could not be deleted");
            }
        } catch (PDOException $e) {
            throw new RuntimeException(
                "Section cannot be deleted because it is being used by another record",
            );
        }
    }

    private function validateData(array $data): void
    {
        $requiredFields = [
            "section_name",
            "semester",
            "academic_year",
            "department_id",
            "student_capacity",
        ];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === "") {
                throw new RuntimeException("$field is required");
            }
        }

        $sectionName = trim($data["section_name"]);

        if ($sectionName === "") {
            throw new RuntimeException("Section name cannot be empty");
        }

        if (strlen($sectionName) > 10) {
            throw new RuntimeException(
                "Section name cannot exceed 10 characters",
            );
        }

        if (
            !is_numeric($data["semester"]) ||
            (int) $data["semester"] < 1 ||
            (int) $data["semester"] > 8
        ) {
            throw new RuntimeException("Semester must be between 1 and 8");
        }

        $academicYear = trim($data["academic_year"]);

        if ($academicYear === "") {
            throw new RuntimeException("Academic year cannot be empty");
        }

        if (strlen($academicYear) > 9) {
            throw new RuntimeException(
                "Academic year cannot exceed 9 characters",
            );
        }

        if (!preg_match("/^\d{4}-\d{2}$/", $academicYear)) {
            throw new RuntimeException("Academic year must use YYYY-YY format");
        }

        if (
            !is_numeric($data["department_id"]) ||
            (int) $data["department_id"] <= 0
        ) {
            throw new RuntimeException(
                "Department ID must be a positive integer",
            );
        }

        if (
            !is_numeric($data["student_capacity"]) ||
            (int) $data["student_capacity"] <= 0
        ) {
            throw new RuntimeException(
                "Student capacity must be a positive integer",
            );
        }
    }
}
