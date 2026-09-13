<?php

declare(strict_types=1);
require_once __DIR__ . "/../controllers/ClassroomController.php";

require_once __DIR__ . "/../controllers/TeacherAvailabilityController.php";

require_once __DIR__ . "/../controllers/TimeSlotController.php";

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

// Classroom routes

$app->get(
    "/api/classrooms",
    [ClassroomController::class, "getAll"]
);

$app->get(
    "/api/classrooms/{id}",
    [ClassroomController::class, "getById"]
);

$app->post(
    "/api/classrooms",
    [ClassroomController::class, "create"]
);

$app->put(
    "/api/classrooms/{id}",
    [ClassroomController::class, "update"]
);

$app->delete(
    "/api/classrooms/{id}",
    [ClassroomController::class, "delete"]
);

// Time Slot routes

$app->get(
    "/api/time-slots",
    [TimeSlotController::class, "getAll"]
);

$app->get(
    "/api/time-slots/{id}",
    [TimeSlotController::class, "getById"]
);

$app->post(
    "/api/time-slots",
    [TimeSlotController::class, "create"]
);

$app->put(
    "/api/time-slots/{id}",
    [TimeSlotController::class, "update"]
);

$app->delete(
    "/api/time-slots/{id}",
    [TimeSlotController::class, "delete"]
);

// Teacher Availability routes

$app->get(
    "/api/teacher-availability",
    [TeacherAvailabilityController::class, "getAll"]
);

$app->get(
    "/api/teacher-availability/{id}",
    [TeacherAvailabilityController::class, "getById"]
);

$app->post(
    "/api/teacher-availability",
    [TeacherAvailabilityController::class, "create"]
);

$app->put(
    "/api/teacher-availability/{id}",
    [TeacherAvailabilityController::class, "update"]
);

$app->delete(
    "/api/teacher-availability/{id}",
    [TeacherAvailabilityController::class, "delete"]
);