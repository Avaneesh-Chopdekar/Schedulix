<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/ClassroomService.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ClassroomController
{
    private ClassroomService $classroomService;

    public function __construct()
    {
        $this->classroomService = new ClassroomService();
    }

    public function getAll(
        Request $request,
        Response $response
    ): Response {

        try {

            $classrooms =
                $this->classroomService->getAllClassrooms();

            $data = array_map(
                function (Classroom $classroom): array {

                    return [
                        "classroom_id" =>
                            $classroom->getClassroomId(),

                        "room_number" =>
                            $classroom->getRoomNumber(),

                        "building" =>
                            $classroom->getBuilding(),

                        "floor" =>
                            $classroom->getFloor(),

                        "capacity" =>
                            $classroom->getCapacity(),

                        "room_type" =>
                            $classroom->getRoomType(),

                        "status" =>
                            $classroom->getStatus(),

                        "created_at" =>
                            $classroom->getCreatedAt(),

                        "updated_at" =>
                            $classroom->getUpdatedAt(),
                    ];
                },
                $classrooms
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
                    "message" => "Internal server error",
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

            $classroom =
                $this->classroomService->getClassroom($id);

            $data = [
                "classroom_id" =>
                    $classroom->getClassroomId(),

                "room_number" =>
                    $classroom->getRoomNumber(),

                "building" =>
                    $classroom->getBuilding(),

                "floor" =>
                    $classroom->getFloor(),

                "capacity" =>
                    $classroom->getCapacity(),

                "room_type" =>
                    $classroom->getRoomType(),

                "status" =>
                    $classroom->getStatus(),

                "created_at" =>
                    $classroom->getCreatedAt(),

                "updated_at" =>
                    $classroom->getUpdatedAt(),
            ];

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
                    "message" => "Internal server error",
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

            $classroom =
                $this->classroomService->createClassroom($data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Classroom created successfully",
                    "data" => [
                        "classroom_id" =>
                            $classroom->getClassroomId(),

                        "room_number" =>
                            $classroom->getRoomNumber(),

                        "building" =>
                            $classroom->getBuilding(),

                        "floor" =>
                            $classroom->getFloor(),

                        "capacity" =>
                            $classroom->getCapacity(),

                        "room_type" =>
                            $classroom->getRoomType(),

                        "status" =>
                            $classroom->getStatus(),

                        "created_at" =>
                            $classroom->getCreatedAt(),

                        "updated_at" =>
                            $classroom->getUpdatedAt(),
                    ],
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
                    "message" => "Internal server error",
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

            $classroom =
                $this->classroomService->updateClassroom(
                    $id,
                    $data
                );

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Classroom updated successfully",
                    "data" => [
                        "classroom_id" =>
                            $classroom->getClassroomId(),

                        "room_number" =>
                            $classroom->getRoomNumber(),

                        "building" =>
                            $classroom->getBuilding(),

                        "floor" =>
                            $classroom->getFloor(),

                        "capacity" =>
                            $classroom->getCapacity(),

                        "room_type" =>
                            $classroom->getRoomType(),

                        "status" =>
                            $classroom->getStatus(),

                        "created_at" =>
                            $classroom->getCreatedAt(),

                        "updated_at" =>
                            $classroom->getUpdatedAt(),
                    ],
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
                    "message" => "Internal server error",
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

            $this->classroomService->deleteClassroom($id);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Classroom deleted successfully",
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
                    "message" => "Internal server error",
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
}