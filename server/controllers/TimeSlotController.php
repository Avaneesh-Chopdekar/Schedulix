<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/TimeSlotService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class TimeSlotController
{
    private TimeSlotService $timeSlotService;

    public function __construct()
    {
        $this->timeSlotService =
            new TimeSlotService();
    }

    public function getAll(
        Request $request,
        Response $response
    ): Response {

        try {

            $timeSlots =
                $this->timeSlotService->getAllTimeSlots();

            $data = array_map(
                function (TimeSlot $timeSlot): array {

                    return [
                        "time_slot_id" =>
                            $timeSlot->getTimeSlotId(),

                        "day" =>
                            $timeSlot->getDay(),

                        "slot_number" =>
                            $timeSlot->getSlotNumber(),

                        "start_time" =>
                            $timeSlot->getStartTime(),

                        "end_time" =>
                            $timeSlot->getEndTime(),

                        "is_break" =>
                            $timeSlot->getIsBreak(),

                        "created_at" =>
                            $timeSlot->getCreatedAt(),
                    ];
                },
                $timeSlots
            );

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $data,
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
                        "Internal server error",
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

            $timeSlot =
                $this->timeSlotService->getTimeSlot($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "data" => $this->toArray($timeSlot),
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
                    "message" => $e->getMessage(),
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
                        "Internal server error",
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

            $data = $request->getParsedBody();

            if (!is_array($data)) {
                throw new RuntimeException(
                    "Invalid request body"
                );
            }

            $timeSlot =
                $this->timeSlotService
                    ->createTimeSlot($data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" =>
                        "Time slot created successfully",
                    "data" =>
                        $this->toArray($timeSlot),
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
                    "message" => $e->getMessage(),
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
                        "Internal server error",
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

            $data = $request->getParsedBody();

            if (!is_array($data)) {
                throw new RuntimeException(
                    "Invalid request body"
                );
            }

            $timeSlot =
                $this->timeSlotService
                    ->updateTimeSlot(
                        $id,
                        $data
                    );

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" =>
                        "Time slot updated successfully",
                    "data" =>
                        $this->toArray($timeSlot),
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
                    "message" => $e->getMessage(),
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
                        "Internal server error",
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

            $this->timeSlotService
                ->deleteTimeSlot($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" =>
                        "Time slot deleted successfully",
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
                    "message" => $e->getMessage(),
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
                        "Internal server error",
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
        TimeSlot $timeSlot
    ): array {

        return [
            "time_slot_id" =>
                $timeSlot->getTimeSlotId(),

            "day" =>
                $timeSlot->getDay(),

            "slot_number" =>
                $timeSlot->getSlotNumber(),

            "start_time" =>
                $timeSlot->getStartTime(),

            "end_time" =>
                $timeSlot->getEndTime(),

            "is_break" =>
                $timeSlot->getIsBreak(),

            "created_at" =>
                $timeSlot->getCreatedAt(),
        ];
    }
}