<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";
require_once __DIR__ . "/../repositories/UserRepository.php";
require_once __DIR__ . "/../repositories/UserSessionRepository.php";

class AuthService
{
    private PDO $connection;
    private UserRepository $userRepository;
    private UserSessionRepository $sessionRepository;

    public function __construct()
    {
        $this->connection = Database::getConnection();

        $this->userRepository = new UserRepository();

        $this->sessionRepository = new UserSessionRepository();
    }

    public function register(array $data): int
    {
        $this->validateRegistrationData($data);

        $email = strtolower(trim($data["email"]));

        $mobileNumber = trim($data["mobile_number"]);

        if ($this->userRepository->getByEmail($email) !== null) {
            throw new RuntimeException(
                "An account with this email already exists.",
            );
        }

        if ($this->userRepository->getByMobileNumber($mobileNumber) !== null) {
            throw new RuntimeException(
                "An account with this mobile number already exists.",
            );
        }

        $passwordHash = $this->hashPassword($data["password"]);

        try {
            $this->connection->beginTransaction();

            $userId = $this->userRepository->create(
                trim($data["first_name"]),
                trim($data["last_name"]),
                $email,
                $mobileNumber,
                $passwordHash,
                $data["role"],
            );

            /*
             * Create the role-specific profile.
             */
            if ($data["role"] === "FACULTY") {
                $this->createTeacherProfile($userId, $data);
            }

            if ($data["role"] === "STUDENT") {
                $this->createStudentProfile($userId, $data);
            }

            $this->connection->commit();

            return $userId;
        } catch (Throwable $exception) {
            if ($this->connection->inTransaction()) {
                $this->connection->rollBack();
            }

            throw $exception;
        }
    }

    public function login(
        string $email,
        string $password,
        bool $rememberMe,
    ): array {
        $user = $this->userRepository->getByEmail($email);

        /*
         * Do not reveal whether the email exists.
         */
        if (
            $user === null ||
            !password_verify($password, $user->getPasswordHash())
        ) {
            throw new RuntimeException("Invalid email or password.");
        }

        if (!$user->isActive()) {
            throw new RuntimeException("Your account has been disabled.");
        }

        $token = bin2hex(random_bytes(32));

        $tokenHash = hash("sha256", $token);

        $expiresAt = $this->getSessionExpiry($rememberMe);

        /*
         * One account can have multiple sessions.
         *
         * We intentionally do NOT delete previous
         * sessions when logging in.
         */
        $this->sessionRepository->create(
            $user->getUserId(),
            $tokenHash,
            $expiresAt,
        );

        return [
            "token" => $token,
            "expires_at" => $expiresAt,
            "user" => $user,
        ];
    }

    public function getUserFromToken(string $token): ?array
    {
        if ($token === "") {
            return null;
        }

        $tokenHash = hash("sha256", $token);

        return $this->sessionRepository->getAuthenticatedSession($tokenHash);
    }

    public function logout(string $token): void
    {
        if ($token === "") {
            return;
        }

        $tokenHash = hash("sha256", $token);

        $this->sessionRepository->revokeByTokenHash($tokenHash);
    }

    private function validateRegistrationData(array $data): void
    {
        $required = [
            "first_name",
            "last_name",
            "email",
            "mobile_number",
            "password",
            "role",
        ];

        foreach ($required as $field) {
            if (!isset($data[$field]) || trim((string) $data[$field]) === "") {
                throw new RuntimeException(
                    ucfirst(str_replace("_", " ", $field)) . " is required.",
                );
            }
        }

        if (!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException("Invalid email address.");
        }

        if (!preg_match("/^[6-9][0-9]{9}$/", $data["mobile_number"])) {
            throw new RuntimeException("Invalid mobile number.");
        }

        if (!in_array($data["role"], ["FACULTY", "STUDENT"], true)) {
            throw new RuntimeException("Invalid registration role.");
        }

        $this->validatePassword($data["password"]);

        if ($data["role"] === "FACULTY") {
            $this->validateFacultyData($data);
        }

        if ($data["role"] === "STUDENT") {
            $this->validateStudentData($data);
        }
    }

    private function validatePassword(string $password): void
    {
        if (strlen($password) < 8) {
            throw new RuntimeException(
                "Password must contain at least 8 characters.",
            );
        }

        if (!preg_match("/[A-Z]/", $password)) {
            throw new RuntimeException(
                "Password must contain an uppercase letter.",
            );
        }

        if (!preg_match("/[a-z]/", $password)) {
            throw new RuntimeException(
                "Password must contain a lowercase letter.",
            );
        }

        if (!preg_match("/[0-9]/", $password)) {
            throw new RuntimeException("Password must contain a number.");
        }
    }

    private function validateFacultyData(array $data): void
    {
        $required = [
            "department_id",
            "employee_id",
            "designation",
            "employment_type",
        ];

        foreach ($required as $field) {
            if (!isset($data[$field]) || trim((string) $data[$field]) === "") {
                throw new RuntimeException(
                    ucfirst(str_replace("_", " ", $field)) .
                        " is required for faculty.",
                );
            }
        }

        if (
            filter_var($data["department_id"], FILTER_VALIDATE_INT) === false ||
            (int) $data["department_id"] < 1
        ) {
            throw new RuntimeException("Invalid department.");
        }
    }

    private function validateStudentData(array $data): void
    {
        $required = ["roll_number", "section_id", "admission_year"];

        foreach ($required as $field) {
            if (!isset($data[$field]) || trim((string) $data[$field]) === "") {
                throw new RuntimeException(
                    ucfirst(str_replace("_", " ", $field)) .
                        " is required for students.",
                );
            }
        }

        if (
            filter_var($data["section_id"], FILTER_VALIDATE_INT) === false ||
            (int) $data["section_id"] < 1
        ) {
            throw new RuntimeException("Invalid section.");
        }

        if (
            filter_var($data["admission_year"], FILTER_VALIDATE_INT) === false ||
            (int) $data["admission_year"] < 2000 ||
            (int) $data["admission_year"] > (int) date("Y")
        ) {
            throw new RuntimeException("Invalid admission year.");
        }
    }

    private function createTeacherProfile(int $userId, array $data): void
    {
        $sql = "
            INSERT INTO teachers (
                user_id,
                department_id,
                employee_id,
                designation,
                employment_type
            )
            VALUES (
                :user_id,
                :department_id,
                :employee_id,
                :designation,
                :employment_type
            )
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":user_id" => $userId,
            ":department_id" => (int) $data["department_id"],
            ":employee_id" => trim($data["employee_id"]),
            ":designation" => trim($data["designation"]),
            ":employment_type" => trim($data["employment_type"]),
        ]);
    }

    private function createStudentProfile(int $userId, array $data): void
    {
        $sql = "
            INSERT INTO students (
                user_id,
                roll_number,
                section_id,
                admission_year
            )
            VALUES (
                :user_id,
                :roll_number,
                :section_id,
                :admission_year
            )
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":user_id" => $userId,
            ":roll_number" => trim($data["roll_number"]),
            ":section_id" => (int) $data["section_id"],
            ":admission_year" => (int) $data["admission_year"],
        ]);
    }

    private function hashPassword(string $password): string
    {
        if (defined("PASSWORD_ARGON2ID")) {
            return password_hash($password, PASSWORD_ARGON2ID);
        }

        return password_hash($password, PASSWORD_DEFAULT);
    }

    private function getSessionExpiry(bool $rememberMe): string
    {
        $date = new DateTimeImmutable("now", new DateTimeZone("UTC"));

        if ($rememberMe) {
            $date = $date->modify("+" . AUTH_REMEMBER_SESSION_DAYS . " days");
        } else {
            $date = $date->modify("+" . AUTH_NORMAL_SESSION_HOURS . " hours");
        }

        return $date->format("Y-m-d H:i:s");
    }
}
