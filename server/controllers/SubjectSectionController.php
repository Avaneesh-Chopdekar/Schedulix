<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/SubjectSectionService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SubjectSectionController
{
    private SubjectSectionService $subjectSectionService;

    public function __construct()
    {
        $this->subjectSectionService = new SubjectSectionService();
    }

    public function getAll(Request $request, Response $response): Response
    {
        try {
            $subjectSections = $this->subjectSectionService->getAllSubjectSections();

            $data = array_map(function (SubjectSection $subjectSection): array {
                return $this->toArray($subjectSection);
            }, $subjectSections);

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

            $subjectSection = $this->subjectSectionService->getSubjectSection(
                $id,
            );

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $this->toArray($subjectSection),
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

    public function getBySubject(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $subjectId = (int) $args["subjectId"];

            $subjectSections = $this->subjectSectionService->getSubjectSectionsBySubject(
                $subjectId,
            );

            $data = array_map(function (SubjectSection $subjectSection): array {
                return $this->toArray($subjectSection);
            }, $subjectSections);

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

    public function getBySection(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $sectionId = (int) $args["sectionId"];

            $subjectSections = $this->subjectSectionService->getSubjectSectionsBySection(
                $sectionId,
            );

            $data = array_map(function (SubjectSection $subjectSection): array {
                return $this->toArray($subjectSection);
            }, $subjectSections);

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

            $subjectSection = $this->subjectSectionService->createSubjectSection(
                $data,
            );

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Subject assigned to section successfully",
                    "data" => $this->toArray($subjectSection),
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

            $subjectSection = $this->subjectSectionService->updateSubjectSection(
                $id,
                $data,
            );

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Subject-section mapping updated successfully",
                    "data" => $this->toArray($subjectSection),
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

            $this->subjectSectionService->deleteSubjectSection($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Subject removed from section successfully",
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

    private function toArray(SubjectSection $subjectSection): array
    {
        return [
            "subject_section_id" => $subjectSection->getSubjectSectionId(),

            "subject_id" => $subjectSection->getSubjectId(),

            "section_id" => $subjectSection->getSectionId(),

            "created_at" => $subjectSection->getCreatedAt(),
        ];
    }
}
