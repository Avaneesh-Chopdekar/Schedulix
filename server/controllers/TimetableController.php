<?php
declare(strict_types=1);

require_once __DIR__ . "/../services/TimetableService.php";
require_once __DIR__ . "/../services/TimetableGenerationService.php";

class TimetableController {
    private TimetableService $service;
    private TimetableGenerationService $generationService;

    public function __construct() {
        require_once __DIR__ . "/../config/database.php";
        $db = Database::getConnection(); 
        $repo = new TimetableRepository($db);
        $this->service = new TimetableService($repo);
        $this->generationService = new TimetableGenerationService(
            new TimetableGenerationRepository($db)
        );
    }

    public function generate($request, $response) {
        try {
            $data = json_decode((string) $request->getBody(), true);
            if (!is_array($data)) {
                throw new InvalidArgumentException("Invalid JSON payload.");
            }
            $authUser = $request->getAttribute("authUser");
            $userId = is_array($authUser) ? (int) ($authUser["user_id"] ?? 0) : 0;
            $data["generated_by"] = (int) ($data["generated_by"] ?? $userId);
            if ($data["generated_by"] < 1) {
                throw new InvalidArgumentException("An authenticated user is required.");
            }
            $result = $this->generationService->generate($data);
            $response->getBody()->write(json_encode([
                "success" => true,
                "data" => [
                    "generation_id" => $result["generation_id"],
                    "created_entries_count" => $result["created_entries_count"],
                    "unscheduled" => $result["unscheduled"],
                    "randomized" => $result["randomized"],
                    "random_seed" => $result["random_seed"],
                ],
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

    public function getAll($request, $response) {
        try {
            $query = $request->getQueryParams();
            $generationId = null;
            if (isset($query['generation_id']) && $query['generation_id'] !== '') {
                $generationId = filter_var($query['generation_id'], FILTER_VALIDATE_INT);
                if ($generationId === false || $generationId < 1) {
                    throw new InvalidArgumentException("generation_id must be a positive integer.");
                }
            }
            $slots = $generationId === null
                ? $this->service->getAllSlots()
                : $this->service->getSlotsByGeneration($generationId);
            $payload = array_map(fn($s) => $s->toArray(), $slots);

            $response->getBody()->write(json_encode(["success" => true, "data" => $payload]));
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
            if ($data === null) throw new InvalidArgumentException("Invalid JSON payload.");

            $newId = $this->service->createSlot($data);

            $response->getBody()->write(json_encode([
                "success" => true, "message" => "Timetable slot created", "timetable_id" => $newId
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

    public function update($request, $response, $args) {
        try {
            $id = (int) $args['id'];
            $data = json_decode((string)$request->getBody(), true);
            if ($data === null) throw new InvalidArgumentException("Invalid JSON payload.");
            $authUser = $request->getAttribute("authUser");
            $data["changed_by"] = is_array($authUser) ? (int) ($authUser["user_id"] ?? 0) : 0;
            
            $this->service->updateSlot($id, $data);

            $response->getBody()->write(json_encode(["success" => true, "message" => "Timetable slot updated"]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        } catch (InvalidArgumentException $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(400);
        } catch (Throwable $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(500);
        }

    }

    public function changes($request, $response) {
        try {
            $query = $request->getQueryParams();
            $generationId = isset($query["generation_id"]) ? (int) $query["generation_id"] : null;
            $response->getBody()->write(json_encode([
                "success" => true,
                "data" => $this->service->getChanges($generationId),
            ]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        } catch (Throwable $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(500);
        }
    }

    public function delete($request, $response, $args) {
        try {
            $id = (int) $args['id'];
            $this->service->deleteSlot($id);
            $response->getBody()->write(json_encode(["success" => true, "message" => "Timetable slot deleted"]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
        } catch (Throwable $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(500);
        }
    }
}