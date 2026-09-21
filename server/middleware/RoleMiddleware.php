<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class RoleMiddleware
{
    private string $requiredRole;

    public function __construct(string $requiredRole)
    {
        $this->requiredRole = $requiredRole;
    }

    public function __invoke(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler,
    ): ResponseInterface {
        $authUser = $request->getAttribute("authUser");

        if (
            !is_array($authUser) ||
            ($authUser["role"] ?? null) !== $this->requiredRole
        ) {
            $response = new \Slim\Psr7\Response();

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" =>
                        "You do not have permission to access this resource.",
                ]),
            );

            return $response
                ->withStatus(403)
                ->withHeader("Content-Type", "application/json");
        }

        return $handler->handle($request);
    }
}
