<?php
declare(strict_types=1);

require_once __DIR__ . "/../services/TimetableGenerationService.php";

class TimetableGenerationController {
    private TimetableGenerationService $service;

    public function __construct() {
        require_once __DIR__ . "/../config/database.php";
        $db = Database::getConnection();
        $repo = new TimetableGenerationRepository($db);
        $this->service = new TimetableGenerationService($repo);
    }

    public function getAll($request, $response) {
        try {
            $generations = $this->service->getAllGenerations();
            $payload = array_map(fn($gen) => $gen->toArray(), $generations);

            $response->getBody()->write(json_encode([
                "success" => true,
                "data" => $payload
            ]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        } catch (Throwable $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(500);
        }

    }

    public function getById($request, $response, $args) {
        try {
            $id = filter_var($args['id'] ?? null, FILTER_VALIDATE_INT);
            if ($id === false || $id < 1) {
                throw new InvalidArgumentException("Generation id must be a positive integer.");
            }
            $generation = $this->service->getGeneration($id);
            if ($generation === null) {
                $response->getBody()->write(json_encode(["success" => false, "message" => "Generation not found."]));
                return $response->withHeader("Content-Type", "application/json")->withStatus(404);
            }
            $response->getBody()->write(json_encode([
                "success" => true,
                "data" => $generation->toArray(),
            ]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        } catch (InvalidArgumentException $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(400);
        } catch (Throwable $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(500);
        }
    }

    public function create($request, $response) {
        try {
            $data = json_decode((string)$request->getBody(), true);
            if ($data === null) {
                throw new InvalidArgumentException("Invalid JSON payload provided.");
            }

            $newId = $this->service->createGeneration($data);

            $response->getBody()->write(json_encode([
                "success" => true,
                "message" => "Timetable generation recorded successfully",
                "generation_id" => $newId
            ]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(201);
        } catch (InvalidArgumentException $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(400);
        } catch (Throwable $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(500);
        }
    }

    public function delete($request, $response, $args) {
        try {
            $id = (int) $args['id'];
            $this->service->deleteGeneration($id);

            $response->getBody()->write(json_encode([
                "success" => true,
                "message" => "Timetable generation record deleted successfully"
            ]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        } catch (Throwable $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(500);
        }
    }
}