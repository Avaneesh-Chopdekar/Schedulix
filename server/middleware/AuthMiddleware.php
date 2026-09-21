<?php

declare(strict_types=1);

require_once __DIR__ . "/../services/AuthService.php";

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthMiddleware
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function __invoke(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler,
    ): ResponseInterface {
        $token = $_COOKIE[AUTH_COOKIE_NAME] ?? "";

        $session = $this->authService->getUserFromToken($token);

        if ($session === null) {
            $response = new \Slim\Psr7\Response();

            $response->getBody()->write(
                json_encode([
                    "success" => false,
                    "message" => "Authentication required.",
                ]),
            );

            return $response
                ->withStatus(401)
                ->withHeader("Content-Type", "application/json");
        }

        /*
         * Make authenticated user available
         * to controllers through the request.
         */
        $request = $request->withAttribute("authUser", $session);

        return $handler->handle($request);
    }
}
