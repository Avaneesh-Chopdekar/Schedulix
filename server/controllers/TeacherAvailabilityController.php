<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/TeacherAvailabilityService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class TeacherAvailabilityController
{
    private TeacherAvailabilityService $service;

    public function __construct()
    {
        $this->service =
            new TeacherAvailabilityService();
    }

    public function getAll(
        Request $request,
        Response $response
    ): Response {

        try {

            $records =
                $this->service->getAll();

            $data = array_map(
                function (
                    TeacherAvailability $record
                ): array {

                    return $this->toArray($record);
                },
                $records
            );

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $data
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(200);

        } catch (Throwable $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        "Internal server error"
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(500);
        }
    }

    public function getById(
        Request $request,
        Response $response,
        array $args
    ): Response {

        try {

            $id = (int) $args["id"];

            $record =
                $this->service->getById($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" =>
                        $this->toArray($record)
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(200);

        } catch (RuntimeException $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        $e->getMessage()
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(404);

        } catch (Throwable $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        "Internal server error"
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(500);
        }
    }

    public function create(
        Request $request,
        Response $response
    ): Response {

        try {

            $data =
                $request->getParsedBody();

            if (!is_array($data)) {
                throw new RuntimeException(
                    "Invalid request body"
                );
            }

            $record =
                $this->service->create($data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" =>
                        "Teacher availability created successfully",
                    "data" =>
                        $this->toArray($record)
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(201);

        } catch (RuntimeException $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        $e->getMessage()
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(400);

        } catch (Throwable $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        "Internal server error"
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(500);
        }
    }

    public function update(
        Request $request,
        Response $response,
        array $args
    ): Response {

        try {

            $id = (int) $args["id"];

            $data =
                $request->getParsedBody();

            if (!is_array($data)) {
                throw new RuntimeException(
                    "Invalid request body"
                );
            }

            $record =
                $this->service->update(
                    $id,
                    $data
                );

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" =>
                        "Teacher availability updated successfully",
                    "data" =>
                        $this->toArray($record)
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(200);

        } catch (RuntimeException $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        $e->getMessage()
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(400);

        } catch (Throwable $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        "Internal server error"
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(500);
        }
    }

    public function delete(
        Request $request,
        Response $response,
        array $args
    ): Response {

        try {

            $id = (int) $args["id"];

            $this->service->delete($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" =>
                        "Teacher availability deleted successfully"
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(200);

        } catch (RuntimeException $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        $e->getMessage()
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(400);

        } catch (Throwable $e) {

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        "Internal server error"
                ])
            );

            return $response
                ->withHeader(
                    "Content-Type",
                    "application/json"
                )
                ->withStatus(500);
        }
    }

    private function toArray(
        TeacherAvailability $record
    ): array {

        return [
            "availability_id" =>
                $record->getAvailabilityId(),

            "teacher_id" =>
                $record->getTeacherId(),

            "time_slot_id" =>
                $record->getTimeSlotId(),

            "day" =>
                $record->getDay(),

            "is_available" =>
                $record->getIsAvailable(),

            "created_at" =>
                $record->getCreatedAt()
        ];
    }
}