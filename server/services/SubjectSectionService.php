<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/SubjectSectionRepository.php";

class SubjectSectionService
{
    private SubjectSectionRepository $subjectSectionRepository;

    public function __construct()
    {
        $this->subjectSectionRepository = new SubjectSectionRepository();
    }

    public function getAllSubjectSections(): array
    {
        return $this->subjectSectionRepository->getAll();
    }

    public function getSubjectSection(int $id): SubjectSection
    {
        if ($id <= 0) {
            throw new RuntimeException("Invalid subject-section ID");
        }

        $subjectSection = $this->subjectSectionRepository->getById($id);

        if ($subjectSection === null) {
            throw new RuntimeException("Subject-section mapping not found");
        }

        return $subjectSection;
    }

    public function getSubjectSectionsBySubject(int $subjectId): array
    {
        $this->validateId($subjectId, "Subject");

        return $this->subjectSectionRepository->getBySubject($subjectId);
    }

    public function getSubjectSectionsBySection(int $sectionId): array
    {
        $this->validateId($sectionId, "Section");

        return $this->subjectSectionRepository->getBySection($sectionId);
    }

    public function createSubjectSection(array $data): SubjectSection
    {
        $this->validateData($data);

        $subjectId = (int) $data["subject_id"];

        $sectionId = (int) $data["section_id"];

        $existing = $this->subjectSectionRepository->getBySubjectAndSection(
            $subjectId,
            $sectionId,
        );

        if ($existing !== null) {
            throw new RuntimeException(
                "This subject is already assigned to this section",
            );
        }

        return $this->subjectSectionRepository->create($subjectId, $sectionId);
    }

    public function updateSubjectSection(int $id, array $data): SubjectSection
    {
        $this->getSubjectSection($id);

        $this->validateData($data);

        $subjectId = (int) $data["subject_id"];

        $sectionId = (int) $data["section_id"];

        $existing = $this->subjectSectionRepository->getBySubjectAndSection(
            $subjectId,
            $sectionId,
            $id,
        );

        if ($existing !== null) {
            throw new RuntimeException(
                "This subject is already assigned to this section",
            );
        }

        $subjectSection = $this->subjectSectionRepository->update(
            $id,
            $subjectId,
            $sectionId,
        );

        if ($subjectSection === null) {
            throw new RuntimeException(
                "Subject-section mapping could not be updated",
            );
        }

        return $subjectSection;
    }

    public function deleteSubjectSection(int $id): void
    {
        $this->getSubjectSection($id);

        try {
            $deleted = $this->subjectSectionRepository->delete($id);

            if (!$deleted) {
                throw new RuntimeException(
                    "Subject-section mapping could not be deleted",
                );
            }
        } catch (PDOException $e) {
            throw new RuntimeException(
                "Subject-section mapping cannot be deleted because it is being used by another record",
            );
        }
    }

    private function validateData(array $data): void
    {
        $requiredFields = ["subject_id", "section_id"];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === "") {
                throw new RuntimeException("$field is required");
            }
        }

        $this->validateId((int) $data["subject_id"], "Subject");

        $this->validateId((int) $data["section_id"], "Section");
    }

    private function validateId(int $id, string $entity): void
    {
        if ($id <= 0) {
            throw new RuntimeException("Invalid $entity ID");
        }
    }
}
