<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";

class AdminDashboardController
{
    public function getSummary(
        Psr\Http\Message\ServerRequestInterface $request,
        Psr\Http\Message\ResponseInterface $response,
    ): Psr\Http\Message\ResponseInterface {
        try {
            $db = Database::getConnection();

            $counts = [];

            $tables = [
                "departments",
                "teachers",
                "students",
                "subjects",
                "classrooms",
                "sections",
            ];

            foreach ($tables as $table) {
                $stmt = $db->query("SELECT COUNT(*) AS total FROM {$table}");

                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                $counts[$table] = (int) $row["total"];
            }

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $counts,
                ]),
            );

            return $response
                ->withStatus(200)
                ->withHeader("Content-Type", "application/json");
        } catch (Throwable $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Failed to load dashboard.",
                ]),
            );

            return $response
                ->withStatus(500)
                ->withHeader("Content-Type", "application/json");
        }
    }
}
