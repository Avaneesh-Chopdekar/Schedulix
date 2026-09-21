<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/User.php";

class UserRepository
{
    private PDO $connection;

    public function __construct()
    {
        $this->connection = Database::getConnection();
    }

    public function getById(int $userId): ?User
    {
        $sql = "
            SELECT
                user_id,
                first_name,
                last_name,
                email,
                mobile_number,
                password_hash,
                role,
                is_active,
                created_at,
                updated_at
            FROM users
            WHERE user_id = :user_id
            LIMIT 1
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":user_id" => $userId,
        ]);

        $row = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return $this->createUser($row);
    }

    public function getByEmail(string $email): ?User
    {
        $sql = "
            SELECT
                user_id,
                first_name,
                last_name,
                email,
                mobile_number,
                password_hash,
                role,
                is_active,
                created_at,
                updated_at
            FROM users
            WHERE email = :email
            LIMIT 1
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":email" => strtolower(trim($email)),
        ]);

        $row = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return $this->createUser($row);
    }

    public function getByMobileNumber(string $mobileNumber): ?User
    {
        $sql = "
            SELECT
                user_id,
                first_name,
                last_name,
                email,
                mobile_number,
                password_hash,
                role,
                is_active,
                created_at,
                updated_at
            FROM users
            WHERE mobile_number = :mobile_number
            LIMIT 1
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":mobile_number" => $mobileNumber,
        ]);

        $row = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return $this->createUser($row);
    }

    public function create(
        string $firstName,
        string $lastName,
        string $email,
        string $mobileNumber,
        string $passwordHash,
        string $role,
    ): int {
        $sql = "
            INSERT INTO users (
                first_name,
                last_name,
                email,
                mobile_number,
                password_hash,
                role
            )
            VALUES (
                :first_name,
                :last_name,
                :email,
                :mobile_number,
                :password_hash,
                :role
            )
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":first_name" => $firstName,
            ":last_name" => $lastName,
            ":email" => $email,
            ":mobile_number" => $mobileNumber,
            ":password_hash" => $passwordHash,
            ":role" => $role,
        ]);

        return (int) $this->connection->lastInsertId();
    }

    public function createAdmin(
        string $firstName,
        string $lastName,
        string $email,
        string $mobileNumber,
        string $passwordHash,
    ): int {
        return $this->create(
            $firstName,
            $lastName,
            $email,
            $mobileNumber,
            $passwordHash,
            "ADMIN",
        );
    }

    private function createUser(array $row): User
    {
        return new User(
            (int) $row["user_id"],
            $row["first_name"],
            $row["last_name"],
            $row["email"],
            $row["mobile_number"],
            $row["password_hash"],
            $row["role"],
            (bool) $row["is_active"],
            $row["created_at"],
            $row["updated_at"],
        );
    }
}
