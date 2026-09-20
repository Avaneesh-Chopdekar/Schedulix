<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/TeacherService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class TeacherController
{
    private TeacherService $teacherService;

    public function __construct()
    {
        $this->teacherService = new TeacherService();
    }

    public function getAll(Request $request, Response $response): Response
    {
        try {
            $teachers = $this->teacherService->getAllTeachers();

            $data = array_map(function (Teacher $teacher): array {
                return $this->toArray($teacher);
            }, $teachers);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $data,
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(200);
        } catch (Throwable $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Internal server error",
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(500);
        }
    }

    public function getById(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $id = (int) $args["id"];

            $teacher = $this->teacherService->getTeacher($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $this->toArray($teacher),
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(200);
        } catch (RuntimeException $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => $e->getMessage(),
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(404);
        } catch (Throwable $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Internal server error",
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(500);
        }
    }

    public function getByDepartment(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $departmentId = (int) $args["departmentId"];

            $teachers = $this->teacherService->getTeachersByDepartment(
                $departmentId,
            );

            $data = array_map(function (Teacher $teacher): array {
                return $this->toArray($teacher);
            }, $teachers);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $data,
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(200);
        } catch (RuntimeException $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => $e->getMessage(),
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400);
        } catch (Throwable $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Internal server error",
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(500);
        }
    }

    public function create(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            if (!is_array($data)) {
                throw new RuntimeException("Invalid request body");
            }

            $teacher = $this->teacherService->createTeacher($data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Teacher created successfully",
                    "data" => $this->toArray($teacher),
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(201);
        } catch (RuntimeException $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => $e->getMessage(),
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400);
        } catch (Throwable $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Internal server error",
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(500);
        }
    }

    public function update(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $id = (int) $args["id"];

            $data = $request->getParsedBody();

            if (!is_array($data)) {
                throw new RuntimeException("Invalid request body");
            }

            $teacher = $this->teacherService->updateTeacher($id, $data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Teacher updated successfully",
                    "data" => $this->toArray($teacher),
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(200);
        } catch (RuntimeException $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => $e->getMessage(),
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400);
        } catch (Throwable $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Internal server error",
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(500);
        }
    }

    public function delete(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $id = (int) $args["id"];

            $this->teacherService->deleteTeacher($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Teacher deleted successfully",
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(200);
        } catch (RuntimeException $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => $e->getMessage(),
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400);
        } catch (Throwable $e) {
            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Internal server error",
                ]),
            );

            return $response
                ->withHeader("Content-Type", "application/json")
                ->withStatus(500);
        }
    }

    private function toArray(Teacher $teacher): array
    {
        return [
            "teacher_id" => $teacher->getTeacherId(),

            "user_id" => $teacher->getUserId(),

            "department_id" => $teacher->getDepartmentId(),

            "employee_id" => $teacher->getEmployeeId(),

            "designation" => $teacher->getDesignation(),

            "employment_type" => $teacher->getEmploymentType(),

            "created_at" => $teacher->getCreatedAt(),

            "updated_at" => $teacher->getUpdatedAt(),
        ];
    }
}
