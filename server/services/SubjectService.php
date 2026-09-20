<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/SubjectRepository.php";

class SubjectService
{
    private SubjectRepository $subjectRepository;

    public function __construct()
    {
        $this->subjectRepository = new SubjectRepository();
    }

    public function getAllSubjects(): array
    {
        return $this->subjectRepository->getAll();
    }

    public function getSubject(int $id): Subject
    {
        if ($id <= 0) {
            throw new RuntimeException("Invalid subject ID");
        }

        $subject = $this->subjectRepository->getById($id);

        if ($subject === null) {
            throw new RuntimeException("Subject not found");
        }

        return $subject;
    }

    public function getSubjectsBySemester(int $semester): array
    {
        if ($semester < 1 || $semester > 8) {
            throw new RuntimeException("Semester must be between 1 and 8");
        }

        return $this->subjectRepository->getBySemester($semester);
    }

    public function getSubjectsByType(string $subjectType): array
    {
        $subjectType = strtoupper(trim($subjectType));

        $validTypes = ["THEORY", "PRACTICAL"];

        if (!in_array($subjectType, $validTypes, true)) {
            throw new RuntimeException("Invalid subject type");
        }

        return $this->subjectRepository->getByType($subjectType);
    }

    public function createSubject(array $data): Subject
    {
        $this->validateData($data);

        $subjectCode = strtoupper(trim($data["subject_code"]));

        $subjectName = trim($data["subject_name"]);

        $semester = (int) $data["semester"];

        $credits = (int) $data["credits"];

        $subjectType = strtoupper(trim($data["subject_type"]));

        $lecturesPerWeek = (int) $data["lectures_per_week"];

        $requiredRoomType = strtoupper(trim($data["required_room_type"]));

        $existing = $this->subjectRepository->getByCode($subjectCode);

        if ($existing !== null) {
            throw new RuntimeException(
                "A subject with this subject code already exists",
            );
        }

        return $this->subjectRepository->create(
            $subjectCode,
            $subjectName,
            $semester,
            $credits,
            $subjectType,
            $lecturesPerWeek,
            $requiredRoomType,
        );
    }

    public function updateSubject(int $id, array $data): Subject
    {
        $this->getSubject($id);

        $this->validateData($data);

        $subjectCode = strtoupper(trim($data["subject_code"]));

        $subjectName = trim($data["subject_name"]);

        $semester = (int) $data["semester"];

        $credits = (int) $data["credits"];

        $subjectType = strtoupper(trim($data["subject_type"]));

        $lecturesPerWeek = (int) $data["lectures_per_week"];

        $requiredRoomType = strtoupper(trim($data["required_room_type"]));

        $existing = $this->subjectRepository->getByCode($subjectCode, $id);

        if ($existing !== null) {
            throw new RuntimeException(
                "Another subject already uses this subject code",
            );
        }

        $subject = $this->subjectRepository->update(
            $id,
            $subjectCode,
            $subjectName,
            $semester,
            $credits,
            $subjectType,
            $lecturesPerWeek,
            $requiredRoomType,
        );

        if ($subject === null) {
            throw new RuntimeException("Subject could not be updated");
        }

        return $subject;
    }

    public function deleteSubject(int $id): void
    {
        $this->getSubject($id);

        try {
            $deleted = $this->subjectRepository->delete($id);

            if (!$deleted) {
                throw new RuntimeException("Subject could not be deleted");
            }
        } catch (PDOException $e) {
            throw new RuntimeException(
                "Subject cannot be deleted because it is being used by another record",
            );
        }
    }

    private function validateData(array $data): void
    {
        $requiredFields = [
            "subject_code",
            "subject_name",
            "semester",
            "credits",
            "subject_type",
            "lectures_per_week",
            "required_room_type",
        ];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === "") {
                throw new RuntimeException("$field is required");
            }
        }

        $subjectCode = trim($data["subject_code"]);

        if ($subjectCode === "") {
            throw new RuntimeException("Subject code cannot be empty");
        }

        if (strlen($subjectCode) > 20) {
            throw new RuntimeException(
                "Subject code cannot exceed 20 characters",
            );
        }

        $subjectName = trim($data["subject_name"]);

        if ($subjectName === "") {
            throw new RuntimeException("Subject name cannot be empty");
        }

        if (strlen($subjectName) > 100) {
            throw new RuntimeException(
                "Subject name cannot exceed 100 characters",
            );
        }

        if (
            !is_numeric($data["semester"]) ||
            (int) $data["semester"] < 1 ||
            (int) $data["semester"] > 8
        ) {
            throw new RuntimeException("Semester must be between 1 and 8");
        }

        if (!is_numeric($data["credits"]) || (int) $data["credits"] <= 0) {
            throw new RuntimeException("Credits must be a positive integer");
        }

        if ((int) $data["credits"] > 10) {
            throw new RuntimeException("Credits cannot exceed 10");
        }

        $validSubjectTypes = ["THEORY", "PRACTICAL"];

        $subjectType = strtoupper(trim($data["subject_type"]));

        if (!in_array($subjectType, $validSubjectTypes, true)) {
            throw new RuntimeException(
                "Subject type must be THEORY or PRACTICAL",
            );
        }

        if (
            !is_numeric($data["lectures_per_week"]) ||
            (int) $data["lectures_per_week"] <= 0
        ) {
            throw new RuntimeException(
                "Lectures per week must be a positive integer",
            );
        }

        if ((int) $data["lectures_per_week"] > 20) {
            throw new RuntimeException("Lectures per week cannot exceed 20");
        }

        $validRoomTypes = ["CLASSROOM", "LAB", "SEMINAR"];

        $requiredRoomType = strtoupper(trim($data["required_room_type"]));

        if (!in_array($requiredRoomType, $validRoomTypes, true)) {
            throw new RuntimeException(
                "Required room type must be CLASSROOM, LAB or SEMINAR",
            );
        }
    }
}
