<?php

declare(strict_types=1);

require __DIR__ . "/../vendor/autoload.php";

use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->get("/", function ($request, $response) {
    $response->getBody()->write(
        json_encode([
            "success" => true,
            "message" => "Schedulix API is running!",
        ]),
    );

    return $response->withHeader("Content-Type", "application/json");
});

$app->run();
