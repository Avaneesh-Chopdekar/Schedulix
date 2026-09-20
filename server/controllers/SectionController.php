<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/SectionService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SectionController
{
    private SectionService $sectionService;

    public function __construct()
    {
        $this->sectionService = new SectionService();
    }

    public function getAll(Request $request, Response $response): Response
    {
        try {
            $sections = $this->sectionService->getAllSections();

            $data = array_map(function (Section $section): array {
                return $this->toArray($section);
            }, $sections);

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

            $section = $this->sectionService->getSection($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $this->toArray($section),
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

            $sections = $this->sectionService->getSectionsByDepartment(
                $departmentId,
            );

            $data = array_map(function (Section $section): array {
                return $this->toArray($section);
            }, $sections);

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

    public function getBySemester(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $semester = (int) $args["semester"];

            $sections = $this->sectionService->getSectionsBySemester($semester);

            $data = array_map(function (Section $section): array {
                return $this->toArray($section);
            }, $sections);

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

    public function getByAcademicYear(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $academicYear = $args["academicYear"];

            $sections = $this->sectionService->getSectionsByAcademicYear(
                $academicYear,
            );

            $data = array_map(function (Section $section): array {
                return $this->toArray($section);
            }, $sections);

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

            $section = $this->sectionService->createSection($data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Section created successfully",
                    "data" => $this->toArray($section),
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

            $section = $this->sectionService->updateSection($id, $data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Section updated successfully",
                    "data" => $this->toArray($section),
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

            $this->sectionService->deleteSection($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Section deleted successfully",
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

    private function toArray(Section $section): array
    {
        return [
            "section_id" => $section->getSectionId(),

            "section_name" => $section->getSectionName(),

            "semester" => $section->getSemester(),

            "academic_year" => $section->getAcademicYear(),

            "department_id" => $section->getDepartmentId(),

            "student_capacity" => $section->getStudentCapacity(),

            "created_at" => $section->getCreatedAt(),
        ];
    }
}
