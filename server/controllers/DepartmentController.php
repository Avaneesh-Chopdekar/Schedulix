<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/DepartmentService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class DepartmentController
{
    private DepartmentService $departmentService;

    public function __construct()
    {
        $this->departmentService = new DepartmentService();
    }

    public function getAll(Request $request, Response $response): Response
    {
        try {
            $departments = $this->departmentService->getAllDepartments();

            $data = array_map(function (Department $department): array {
                return [
                    "department_id" => $department->getDepartmentId(),

                    "department_name" => $department->getDepartmentName(),

                    "created_at" => $department->getCreatedAt(),
                ];
            }, $departments);

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

            $department = $this->departmentService->getDepartment($id);

            $data = [
                "department_id" => $department->getDepartmentId(),

                "department_name" => $department->getDepartmentName(),

                "created_at" => $department->getCreatedAt(),
            ];

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
}
