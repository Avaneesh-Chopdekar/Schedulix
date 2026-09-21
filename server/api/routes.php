<?php

declare(strict_types=1);
require_once __DIR__ . "/../controllers/ClassroomController.php";

require_once __DIR__ . "/../controllers/TeacherAvailabilityController.php";

require_once __DIR__ . "/../controllers/TimeSlotController.php";

require_once __DIR__ . "/../controllers/DepartmentController.php";

require_once __DIR__ . "/../controllers/SchedulingConstraintController.php";

require_once __DIR__ . "/../controllers/TimetableGenerationController.php";

require_once __DIR__ . "/../controllers/TimetableController.php";

require_once __DIR__ . "/../controllers/TeacherController.php";

require_once __DIR__ . "/../controllers/StudentController.php";

require_once __DIR__ . "/../controllers/SectionController.php";

require_once __DIR__ . "/../controllers/SubjectController.php";

require_once __DIR__ . "/../controllers/SubjectSectionController.php";

require_once __DIR__ . "/../controllers/AuthController.php";

require_once __DIR__ . "/../controllers/AdminDashboardController.php";

require_once __DIR__ . "/../controllers/AdminController.php";

require_once __DIR__ . "/../middleware/AuthMiddleware.php";

require_once __DIR__ . "/../middleware/RoleMiddleware.php";

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

//Scheduling constraints routes
$app->get("/api/scheduling/constraints", [
    SchedulingConstraintController::class,
    "getAll",
]);

$app->post("/api/scheduling/constraints", [
    SchedulingConstraintController::class,
    "create",
]);

$app->put("/api/scheduling/constraints/{id}", [
    SchedulingConstraintController::class,
    "update",
]);

$app->delete("/api/scheduling/constraints/{id}", [
    SchedulingConstraintController::class,
    "delete",
]);

// timetable generation routes
$app->get("/api/timetable/generations", [
    TimetableGenerationController::class,
    "getAll",
]);

$app->post("/api/timetable/generations", [
    TimetableGenerationController::class,
    "create",
]);

$app->delete("/api/timetable/generations/{id}", [
    TimetableGenerationController::class,
    "delete",
]);

// timetable routes
$app->get("/api/timetable", [TimetableController::class, "getAll"]);

$app->post("/api/timetable", [TimetableController::class, "create"]);

$app->put("/api/timetable/{id}", [TimetableController::class, "update"]);

$app->delete("/api/timetable/{id}", [TimetableController::class, "delete"]);
// Classroom routes

$app->get("/api/classrooms", [ClassroomController::class, "getAll"]);

$app->get("/api/classrooms/{id}", [ClassroomController::class, "getById"]);

$app->post("/api/classrooms", [ClassroomController::class, "create"]);

$app->put("/api/classrooms/{id}", [ClassroomController::class, "update"]);

$app->delete("/api/classrooms/{id}", [ClassroomController::class, "delete"]);

// Time Slot routes

$app->get("/api/time-slots", [TimeSlotController::class, "getAll"]);

$app->get("/api/time-slots/{id}", [TimeSlotController::class, "getById"]);

$app->post("/api/time-slots", [TimeSlotController::class, "create"]);

$app->put("/api/time-slots/{id}", [TimeSlotController::class, "update"]);

$app->delete("/api/time-slots/{id}", [TimeSlotController::class, "delete"]);

// Teacher Availability routes

$app->get("/api/teacher-availability", [
    TeacherAvailabilityController::class,
    "getAll",
]);

$app->get("/api/teacher-availability/{id}", [
    TeacherAvailabilityController::class,
    "getById",
]);

$app->post("/api/teacher-availability", [
    TeacherAvailabilityController::class,
    "create",
]);

$app->put("/api/teacher-availability/{id}", [
    TeacherAvailabilityController::class,
    "update",
]);

$app->delete("/api/teacher-availability/{id}", [
    TeacherAvailabilityController::class,
    "delete",
]);

// Teacher routes

$app->get("/api/teachers", [TeacherController::class, "getAll"]);

$app->get("/api/teachers/{id}", [TeacherController::class, "getById"]);

$app->get("/api/departments/{departmentId}/teachers", [
    TeacherController::class,
    "getByDepartment",
]);

$app->post("/api/teachers", [TeacherController::class, "create"]);

$app->put("/api/teachers/{id}", [TeacherController::class, "update"]);

$app->delete("/api/teachers/{id}", [TeacherController::class, "delete"]);

// Student routes

$app->get("/api/students", [StudentController::class, "getAll"]);

$app->get("/api/students/{id}", [StudentController::class, "getById"]);

$app->get("/api/sections/{sectionId}/students", [
    StudentController::class,
    "getBySection",
]);

$app->post("/api/students", [StudentController::class, "create"]);

$app->put("/api/students/{id}", [StudentController::class, "update"]);

$app->delete("/api/students/{id}", [StudentController::class, "delete"]);

// Section routes

$app->get("/api/sections", [SectionController::class, "getAll"]);

$app->get("/api/sections/{id}", [SectionController::class, "getById"]);

$app->get("/api/departments/{departmentId}/sections", [
    SectionController::class,
    "getByDepartment",
]);

$app->get("/api/sections/semester/{semester}", [
    SectionController::class,
    "getBySemester",
]);

$app->get("/api/sections/academic-year/{academicYear}", [
    SectionController::class,
    "getByAcademicYear",
]);

$app->post("/api/sections", [SectionController::class, "create"]);

$app->put("/api/sections/{id}", [SectionController::class, "update"]);

$app->delete("/api/sections/{id}", [SectionController::class, "delete"]);

// Subject routes

$app->get("/api/subjects", [SubjectController::class, "getAll"]);

$app->get("/api/subjects/{id}", [SubjectController::class, "getById"]);

$app->get("/api/subjects/semester/{semester}", [
    SubjectController::class,
    "getBySemester",
]);

$app->get("/api/subjects/type/{subjectType}", [
    SubjectController::class,
    "getByType",
]);

$app->post("/api/subjects", [SubjectController::class, "create"]);

$app->put("/api/subjects/{id}", [SubjectController::class, "update"]);

$app->delete("/api/subjects/{id}", [SubjectController::class, "delete"]);

// Subject-Section routes

$app->get("/api/subject-sections", [SubjectSectionController::class, "getAll"]);

$app->get("/api/subject-sections/{id}", [
    SubjectSectionController::class,
    "getById",
]);

$app->get("/api/subject-sections/subject/{subjectId}", [
    SubjectSectionController::class,
    "getBySubject",
]);

$app->get("/api/subject-sections/section/{sectionId}", [
    SubjectSectionController::class,
    "getBySection",
]);

$app->post("/api/subject-sections", [
    SubjectSectionController::class,
    "create",
]);

$app->put("/api/subject-sections/{id}", [
    SubjectSectionController::class,
    "update",
]);

$app->delete("/api/subject-sections/{id}", [
    SubjectSectionController::class,
    "delete",
]);

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

$app->post("/api/auth/register", [AuthController::class, "register"]);

$app->post("/api/auth/login", [AuthController::class, "login"]);

$app->get("/api/auth/me", [AuthController::class, "me"])->add(
    new AuthMiddleware(),
);

$app->post("/api/auth/logout", [AuthController::class, "logout"])->add(
    new AuthMiddleware(),
);

$app->get("/api/auth/sessions", [AuthController::class, "getSessions"])->add(
    new AuthMiddleware(),
);

$app->delete("/api/auth/sessions/{id}", [
    AuthController::class,
    "revokeSession",
])->add(new AuthMiddleware());

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

$app->get("/api/admin/dashboard", [AdminController::class, "dashboard"])
    ->add(new RoleMiddleware("ADMIN"))
    ->add(new AuthMiddleware());
