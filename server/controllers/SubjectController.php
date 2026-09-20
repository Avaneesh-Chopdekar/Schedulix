<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/SubjectService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SubjectController
{
    private SubjectService $subjectService;

    public function __construct()
    {
        $this->subjectService = new SubjectService();
    }

    public function getAll(Request $request, Response $response): Response
    {
        try {
            $subjects = $this->subjectService->getAllSubjects();

            $data = array_map(function (Subject $subject): array {
                return $this->toArray($subject);
            }, $subjects);

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

            $subject = $this->subjectService->getSubject($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $this->toArray($subject),
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

    public function getBySemester(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $semester = (int) $args["semester"];

            $subjects = $this->subjectService->getSubjectsBySemester($semester);

            $data = array_map(function (Subject $subject): array {
                return $this->toArray($subject);
            }, $subjects);

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

    public function getByType(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $subjectType = $args["subjectType"];

            $subjects = $this->subjectService->getSubjectsByType($subjectType);

            $data = array_map(function (Subject $subject): array {
                return $this->toArray($subject);
            }, $subjects);

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

            $subject = $this->subjectService->createSubject($data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Subject created successfully",
                    "data" => $this->toArray($subject),
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

            $subject = $this->subjectService->updateSubject($id, $data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Subject updated successfully",
                    "data" => $this->toArray($subject),
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

            $this->subjectService->deleteSubject($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Subject deleted successfully",
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

    private function toArray(Subject $subject): array
    {
        return [
            "subject_id" => $subject->getSubjectId(),

            "subject_code" => $subject->getSubjectCode(),

            "subject_name" => $subject->getSubjectName(),

            "semester" => $subject->getSemester(),

            "credits" => $subject->getCredits(),

            "subject_type" => $subject->getSubjectType(),

            "lectures_per_week" => $subject->getLecturesPerWeek(),

            "required_room_type" => $subject->getRequiredRoomType(),

            "created_at" => $subject->getCreatedAt(),
        ];
    }
}
