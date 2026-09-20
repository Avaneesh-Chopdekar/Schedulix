<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/StudentService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class StudentController
{
    private StudentService $studentService;

    public function __construct()
    {
        $this->studentService = new StudentService();
    }

    public function getAll(Request $request, Response $response): Response
    {
        try {
            $students = $this->studentService->getAllStudents();

            $data = array_map(function (Student $student): array {
                return $this->toArray($student);
            }, $students);

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

            $student = $this->studentService->getStudent($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $this->toArray($student),
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

    public function getBySection(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $sectionId = (int) $args["sectionId"];

            $students = $this->studentService->getStudentsBySection($sectionId);

            $data = array_map(function (Student $student): array {
                return $this->toArray($student);
            }, $students);

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

            $student = $this->studentService->createStudent($data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Student created successfully",
                    "data" => $this->toArray($student),
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

            $student = $this->studentService->updateStudent($id, $data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Student updated successfully",
                    "data" => $this->toArray($student),
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

            $this->studentService->deleteStudent($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Student deleted successfully",
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

    private function toArray(Student $student): array
    {
        return [
            "student_id" => $student->getStudentId(),

            "user_id" => $student->getUserId(),

            "roll_number" => $student->getRollNumber(),

            "section_id" => $student->getSectionId(),

            "admission_year" => $student->getAdmissionYear(),

            "created_at" => $student->getCreatedAt(),

            "updated_at" => $student->getUpdatedAt(),
        ];
    }
}
