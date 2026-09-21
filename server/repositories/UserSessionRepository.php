<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";

class UserSessionRepository
{
    private PDO $connection;

    public function __construct()
    {
        $this->connection = Database::getConnection();
    }

    public function create(
        int $userId,
        string $tokenHash,
        string $expiresAt,
    ): int {
        $sql = "
            INSERT INTO user_sessions (
                user_id,
                token_hash,
                expires_at
            )
            VALUES (
                :user_id,
                :token_hash,
                :expires_at
            )
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":user_id" => $userId,
            ":token_hash" => $tokenHash,
            ":expires_at" => $expiresAt,
        ]);

        return (int) $this->connection->lastInsertId();
    }

    public function getAuthenticatedSession(string $tokenHash): ?array
    {
        $sql = "
            SELECT
                us.session_id,
                us.user_id,
                us.token_hash,
                us.expires_at,
                us.created_at,
                us.revoked_at,
                u.first_name,
                u.last_name,
                u.email,
                u.mobile_number,
                u.role,
                u.is_active
            FROM user_sessions us
            INNER JOIN users u
                ON u.user_id = us.user_id
            WHERE us.token_hash = :token_hash
                AND us.revoked_at IS NULL
                AND us.expires_at > CURRENT_TIMESTAMP
                AND u.is_active = TRUE
            LIMIT 1
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":token_hash" => $tokenHash,
        ]);

        $row = $statement->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function revokeByTokenHash(string $tokenHash): void
    {
        $sql = "
            UPDATE user_sessions
            SET revoked_at = CURRENT_TIMESTAMP
            WHERE token_hash = :token_hash
                AND revoked_at IS NULL
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":token_hash" => $tokenHash,
        ]);
    }

    public function getByUserId(int $userId): array
    {
        $sql = "
            SELECT
                session_id,
                user_id,
                token_hash,
                expires_at,
                created_at,
                revoked_at
            FROM user_sessions
            WHERE user_id = :user_id
            ORDER BY created_at DESC
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":user_id" => $userId,
        ]);

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function revokeByIdForUser(int $sessionId, int $userId): bool
    {
        $sql = "
            UPDATE user_sessions
            SET revoked_at = CURRENT_TIMESTAMP
            WHERE session_id = :session_id
                AND user_id = :user_id
                AND revoked_at IS NULL
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":session_id" => $sessionId,
            ":user_id" => $userId,
        ]);

        return $statement->rowCount() > 0;
    }

    public function revokeAllForUser(int $userId): void
    {
        $sql = "
            UPDATE user_sessions
            SET revoked_at = CURRENT_TIMESTAMP
            WHERE user_id = :user_id
                AND revoked_at IS NULL
        ";

        $statement = $this->connection->prepare($sql);

        $statement->execute([
            ":user_id" => $userId,
        ]);
    }

    public function cleanupExpired(): void
    {
        $sql = "
            DELETE FROM user_sessions
            WHERE expires_at <= CURRENT_TIMESTAMP
                OR revoked_at IS NOT NULL
        ";

        $this->connection->exec($sql);
    }
}
