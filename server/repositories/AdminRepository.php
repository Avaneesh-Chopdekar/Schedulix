<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";

class AdminRepository
{
    private PDO $connection;

    public function __construct()
    {
        $this->connection = Database::getConnection();
    }

    public function getDashboardStats(): array
    {
        return [
            "users" => $this->getCount("users"),

            "teachers" => $this->getCount("teachers"),

            "students" => $this->getCount("students"),

            "departments" => $this->getCount("departments"),

            "subjects" => $this->getCount("subjects"),

            "sections" => $this->getCount("sections"),

            "classrooms" => $this->getCount("classrooms"),
        ];
    }

    private function getCount(string $table): int
    {
        /*
         * Table names cannot be bound as PDO parameters.
         *
         * This method only accepts internal,
         * hard-coded table names.
         */
        $allowedTables = [
            "users",
            "teachers",
            "students",
            "departments",
            "subjects",
            "sections",
            "classrooms",
        ];

        if (!in_array($table, $allowedTables, true)) {
            throw new RuntimeException("Invalid table.");
        }

        $sql = "SELECT COUNT(*) FROM {$table}";

        return (int) $this->connection->query($sql)->fetchColumn();
    }
}
