<?php

declare(strict_types=1);

require __DIR__ . "/../vendor/autoload.php";

use Slim\Factory\AppFactory;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/..");

$dotenv->load();

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

require __DIR__ . "/routes.php";

$app->add(function (
    Psr\Http\Message\ServerRequestInterface $request,
    Psr\Http\Server\RequestHandlerInterface $handler,
): Psr\Http\Message\ResponseInterface {
    $path = $request->getUri()->getPath();

    $publicPaths = [
        "/api/health",
        "/api/auth/login",
        "/api/auth/register",
    ];

    if (
        $request->getMethod() === "OPTIONS" ||
        !str_starts_with($path, "/api/") ||
        in_array($path, $publicPaths, true)
    ) {
        return $handler->handle($request);
    }

    return (new AuthMiddleware())($request, $handler);
});

$app->addErrorMiddleware(true, true, true);

$app->add(function (
    Psr\Http\Message\ServerRequestInterface $request,
    Psr\Http\Server\RequestHandlerInterface $handler,
): Psr\Http\Message\ResponseInterface {
    $response = $handler->handle($request);

    return $response
        ->withHeader("Access-Control-Allow-Origin", "http://localhost:5173")
        ->withHeader("Access-Control-Allow-Credentials", "true")
        ->withHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization",
        )
        ->withHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS",
        );
});

$app->options("/{routes:.+}", function (
    Psr\Http\Message\ServerRequestInterface $request,
    Psr\Http\Message\ResponseInterface $response,
): Psr\Http\Message\ResponseInterface {
    return $response;
});

$app->run();
