<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/SubjectSection.php";

class SubjectSectionRepository
{
    private PDO $connection;

    public function __construct()
    {
        $this->connection = Database::getConnection();
    }

    public function getAll(): array
    {
        $sql = "
            SELECT
                subject_section_id,
                subject_id,
                section_id,
                created_at
            FROM subject_sections
            ORDER BY
                subject_id ASC,
                section_id ASC
        ";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute();

        $subjectSections = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $subjectSections[] = $this->createSubjectSection($row);
        }

        return $subjectSections;
    }

    public function getById(int $id): ?SubjectSection
    {
        $sql = "
            SELECT
                subject_section_id,
                subject_id,
                section_id,
                created_at
            FROM subject_sections
            WHERE subject_section_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createSubjectSection($row);
    }

    public function getBySubjectAndSection(
        int $subjectId,
        int $sectionId,
        ?int $excludeId = null,
    ): ?SubjectSection {
        if ($excludeId === null) {
            $sql = "
                SELECT
                    subject_section_id,
                    subject_id,
                    section_id,
                    created_at
                FROM subject_sections
                WHERE subject_id = :subject_id
                AND section_id = :section_id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "subject_id" => $subjectId,
                "section_id" => $sectionId,
            ]);
        } else {
            $sql = "
                SELECT
                    subject_section_id,
                    subject_id,
                    section_id,
                    created_at
                FROM subject_sections
                WHERE subject_id = :subject_id
                AND section_id = :section_id
                AND subject_section_id != :id
            ";

            $stmt = $this->connection->prepare($sql);

            $stmt->execute([
                "subject_id" => $subjectId,
                "section_id" => $sectionId,
                "id" => $excludeId,
            ]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row === false) {
            return null;
        }

        return $this->createSubjectSection($row);
    }

    public function getBySubject(int $subjectId): array
    {
        $sql = "
            SELECT
                subject_section_id,
                subject_id,
                section_id,
                created_at
            FROM subject_sections
            WHERE subject_id = :subject_id
            ORDER BY section_id ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "subject_id" => $subjectId,
        ]);

        $subjectSections = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $subjectSections[] = $this->createSubjectSection($row);
        }

        return $subjectSections;
    }

    public function getBySection(int $sectionId): array
    {
        $sql = "
            SELECT
                subject_section_id,
                subject_id,
                section_id,
                created_at
            FROM subject_sections
            WHERE section_id = :section_id
            ORDER BY subject_id ASC
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "section_id" => $sectionId,
        ]);

        $subjectSections = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $subjectSections[] = $this->createSubjectSection($row);
        }

        return $subjectSections;
    }

    public function create(int $subjectId, int $sectionId): SubjectSection
    {
        $sql = "
            INSERT INTO subject_sections
            (
                subject_id,
                section_id
            )
            VALUES
            (
                :subject_id,
                :section_id
            )
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "subject_id" => $subjectId,
            "section_id" => $sectionId,
        ]);

        return $this->getById((int) $this->connection->lastInsertId());
    }

    public function update(
        int $id,
        int $subjectId,
        int $sectionId,
    ): ?SubjectSection {
        $sql = "
            UPDATE subject_sections
            SET
                subject_id = :subject_id,
                section_id = :section_id
            WHERE subject_section_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "subject_id" => $subjectId,
            "section_id" => $sectionId,
            "id" => $id,
        ]);

        return $this->getById($id);
    }

    public function delete(int $id): bool
    {
        $sql = "
            DELETE FROM subject_sections
            WHERE subject_section_id = :id
        ";

        $stmt = $this->connection->prepare($sql);

        $stmt->execute([
            "id" => $id,
        ]);

        return $stmt->rowCount() > 0;
    }

    private function createSubjectSection(array $row): SubjectSection
    {
        return new SubjectSection(
            (int) $row["subject_section_id"],
            (int) $row["subject_id"],
            (int) $row["section_id"],
            $row["created_at"],
        );
    }
}
