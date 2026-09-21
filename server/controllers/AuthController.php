<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/auth.php";
require_once __DIR__ . "/../services/AuthService.php";
require_once __DIR__ . "/../repositories/UserSessionRepository.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    private AuthService $authService;
    private UserSessionRepository $sessionRepository;

    public function __construct()
    {
        $this->authService = new AuthService();

        $this->sessionRepository = new UserSessionRepository();
    }

    public function register(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            if (!is_array($data)) {
                throw new RuntimeException("Invalid request body.");
            }

            $userId = $this->authService->register($data);

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Account created successfully.",
                    "user_id" => $userId,
                ]),
            );

            return $response
                ->withStatus(201)
                ->withHeader("Content-Type", "application/json");
        } catch (RuntimeException $exception) {
            return $this->errorResponse(
                $response,
                $exception->getMessage(),
                400,
            );
        } catch (Throwable $exception) {
            error_log($exception->getMessage());

            return $this->errorResponse($response, "Registration failed.", 500);
        }
    }

    public function login(Request $request, Response $response): Response
    {
        try {
            $data = $request->getParsedBody();

            if (!is_array($data)) {
                throw new RuntimeException("Invalid request body.");
            }

            $email = trim((string) ($data["email"] ?? ""));

            $password = (string) ($data["password"] ?? "");

            $rememberMe = (bool) ($data["remember_me"] ?? false);

            $result = $this->authService->login($email, $password, $rememberMe);

            $response = $this->setSessionCookie(
                $response,
                $result["token"],
                $result["expires_at"],
            );

            $user = $result["user"];

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Login successful.",
                    "user" => $this->userToArray($user),
                ]),
            );

            return $response->withHeader("Content-Type", "application/json");
        } catch (RuntimeException $exception) {
            return $this->errorResponse(
                $response,
                $exception->getMessage(),
                401,
            );
        } catch (Throwable $exception) {
            error_log($exception->getMessage());

            return $this->errorResponse($response, "Login failed.", 500);
        }
    }

    public function me(Request $request, Response $response): Response
    {
        $authUser = $request->getAttribute("authUser");

        if (!is_array($authUser)) {
            return $this->errorResponse(
                $response,
                "Authentication required.",
                401,
            );
        }

        $response->getBody()->write(
            json_encode([
                "success" => true,
                "user" => [
                    "user_id" => (int) $authUser["user_id"],
                    "first_name" => $authUser["first_name"],
                    "last_name" => $authUser["last_name"],
                    "email" => $authUser["email"],
                    "mobile_number" => $authUser["mobile_number"],
                    "role" => $authUser["role"],
                    "is_active" => (bool) $authUser["is_active"],
                ],
            ]),
        );

        return $response->withHeader("Content-Type", "application/json");
    }

    public function logout(Request $request, Response $response): Response
    {
        $token = $_COOKIE[AUTH_COOKIE_NAME] ?? "";

        $this->authService->logout($token);

        $response = $this->clearSessionCookie($response);

        $response->getBody()->write(
            json_encode([
                "success" => true,
                "message" => "Logged out successfully.",
            ]),
        );

        return $response->withHeader("Content-Type", "application/json");
    }

    public function getSessions(Request $request, Response $response): Response
    {
        $authUser = $request->getAttribute("authUser");

        $userId = (int) $authUser["user_id"];

        $currentToken = $_COOKIE[AUTH_COOKIE_NAME] ?? "";

        $currentHash = hash("sha256", $currentToken);

        $sessions = $this->sessionRepository->getByUserId($userId);

        $result = [];

        foreach ($sessions as $session) {
            $result[] = [
                "session_id" => (int) $session["session_id"],
                "created_at" => $session["created_at"],
                "expires_at" => $session["expires_at"],
                "revoked_at" => $session["revoked_at"],
                "is_current" => hash_equals(
                    $currentHash,
                    $session["token_hash"],
                ),
            ];
        }

        $response->getBody()->write(
            json_encode([
                "success" => true,
                "sessions" => $result,
            ]),
        );

        return $response->withHeader("Content-Type", "application/json");
    }

    public function revokeSession(
        Request $request,
        Response $response,
        array $args,
    ): Response {
        try {
            $authUser = $request->getAttribute("authUser");

            $sessionId = (int) $args["id"];

            $success = $this->sessionRepository->revokeByIdForUser(
                $sessionId,
                (int) $authUser["user_id"],
            );

            if (!$success) {
                throw new RuntimeException("Session not found.");
            }

            $response->getBody()->write(
                json_encode([
                    "success" => true,
                    "message" => "Session revoked.",
                ]),
            );

            return $response->withHeader("Content-Type", "application/json");
        } catch (RuntimeException $exception) {
            return $this->errorResponse(
                $response,
                $exception->getMessage(),
                404,
            );
        }
    }

    private function setSessionCookie(
        Response $response,
        string $token,
        string $expiresAt,
    ): Response {
        /*
         * PHP's setcookie() is normally used for
         * PHP-generated responses. Here we add the
         * Set-Cookie header to the immutable PSR-7
         * response instead.
         */

        $expiresTimestamp = strtotime($expiresAt);

        $cookie =
            AUTH_COOKIE_NAME .
            "=" .
            rawurlencode($token) .
            "; Max-Age=" .
            max(0, $expiresTimestamp - time()) .
            "; Expires=" .
            gmdate("D, d M Y H:i:s", $expiresTimestamp) .
            " GMT" .
            "; Path=" .
            AUTH_COOKIE_PATH .
            "; HttpOnly" .
            "; SameSite=" .
            AUTH_COOKIE_SAME_SITE;

        if (AUTH_COOKIE_SECURE) {
            $cookie .= "; Secure";
        }

        return $response->withAddedHeader("Set-Cookie", $cookie);
    }

    private function clearSessionCookie(Response $response): Response
    {
        $cookie =
            AUTH_COOKIE_NAME .
            "=;" .
            " Max-Age=0;" .
            " Expires=Thu, 01 Jan 1970 00:00:00 GMT;" .
            " Path=" .
            AUTH_COOKIE_PATH .
            ";" .
            " HttpOnly;" .
            " SameSite=" .
            AUTH_COOKIE_SAME_SITE;

        if (AUTH_COOKIE_SECURE) {
            $cookie .= "; Secure";
        }

        return $response->withAddedHeader("Set-Cookie", $cookie);
    }

    private function userToArray(User $user): array
    {
        return [
            "user_id" => $user->getUserId(),
            "first_name" => $user->getFirstName(),
            "last_name" => $user->getLastName(),
            "email" => $user->getEmail(),
            "mobile_number" => $user->getMobileNumber(),
            "role" => $user->getRole(),
            "is_active" => $user->isActive(),
            "created_at" => $user->getCreatedAt(),
        ];
    }

    private function errorResponse(
        Response $response,
        string $message,
        int $status,
    ): Response {
        $response->getBody()->write(
            json_encode([
                "success" => false,
                "message" => $message,
            ]),
        );

        return $response
            ->withStatus($status)
            ->withHeader("Content-Type", "application/json");
    }
}
