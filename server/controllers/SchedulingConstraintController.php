<?php
declare(strict_types=1);

require_once __DIR__ . "/../services/SchedulingConstraintService.php";

class SchedulingConstraintController {
    private SchedulingConstraintService $service;

    public function __construct() {
        require_once __DIR__ . "/../config/database.php";
        $db = Database::getConnection(); 
        $repo = new SchedulingConstraintRepository($db);
        $this->service = new SchedulingConstraintService($repo);
    }

    public function getAll($request, $response) {
        try {
            $constraints = $this->service->getAllConstraints();
            $payload = array_map(fn($c) => $c->toArray(), $constraints);

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

    public function create($request, $response) {
        try {
            $data = json_decode((string)$request->getBody(), true);
            if ($data === null) {
                throw new InvalidArgumentException("Invalid JSON payload provided.");
            }

            $newId = $this->service->createConstraint($data);

            $response->getBody()->write(json_encode([
                "success" => true,
                "message" => "Scheduling constraint created successfully",
                "constraint_id" => $newId
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
            
            if ($data === null) {
                throw new InvalidArgumentException("Invalid JSON payload provided.");
            }
            
            $this->service->updateConstraint($id, $data);

            $response->getBody()->write(json_encode([
                "success" => true,
                "message" => "Constraint updated successfully"
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

    public function delete($request, $response, $args) {
        try {
            $id = (int) $args['id'];
            $this->service->deleteConstraint($id);

            $response->getBody()->write(json_encode([
                "success" => true,
                "message" => "Constraint deleted successfully"
            ]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(200);

        } catch (Throwable $e) {
            $response->getBody()->write(json_encode(["success" => false, "message" => $e->getMessage()]));
            return $response->withHeader("Content-Type", "application/json")->withStatus(500);
        }
    }
}