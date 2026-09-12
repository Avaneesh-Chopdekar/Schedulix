<?php

declare(strict_types=1);

require_once __DIR__ . "/../controllers/DepartmentController.php";

$app->get("/api/health", function ($request, $response) {
    $response->getBody()->write(
        json_encode([
            "success" => true,
            "message" => "API is healthy",
        ]),
    );

    return $response->withHeader("Content-Type", "application/json");
});

// Department routes

$app->get("/api/departments", [DepartmentController::class, "getAll"]);

$app->get("/api/departments/{id}", [DepartmentController::class, "getById"]);
