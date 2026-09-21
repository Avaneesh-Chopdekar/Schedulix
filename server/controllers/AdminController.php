<?php

declare(strict_types=1);

require_once __DIR__ . "/../repositories/AdminRepository.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AdminController
{
    private AdminRepository $repository;

    public function __construct()
    {
        $this->repository = new AdminRepository();
    }

    public function dashboard(Request $request, Response $response): Response
    {
        try {
            $stats = $this->repository->getDashboardStats();

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $stats,
                ]),
            );

            return $response->withHeader("Content-Type", "application/json");
        } catch (Throwable $exception) {
            error_log($exception->getMessage());

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Unable to load dashboard.",
                ]),
            );

            return $response
                ->withStatus(500)
                ->withHeader("Content-Type", "application/json");
        }
    }
}
