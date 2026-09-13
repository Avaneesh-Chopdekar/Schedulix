<?php
declare(strict_types=1);

require_once __DIR__ . "/../services/TimetableService.php";

class TimetableController {
    private TimetableService $service;

    public function __construct() {
        require_once __DIR__ . "/../config/database.php";
        $db = Database::getConnection(); 
        $repo = new TimetableRepository($db);
        $this->service = new TimetableService($repo);
    }

    public function getAll($request, $response) {
        try {
            $slots = $this->service->getAllSlots();
            $payload = array_map(fn($s) => $s->toArray(), $slots);

            $response->getBody()->write(json_encode(["success" => true, "data" => $payload]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);
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
            
            $this->service->updateSlot($id, $data);

            $response->getBody()->write(json_encode(["success" => true, "message" => "Timetable slot updated"]));
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