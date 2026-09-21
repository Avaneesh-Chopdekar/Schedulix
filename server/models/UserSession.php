<?php

declare(strict_types=1);

class UserSession
{
    private int $sessionId;
    private int $userId;
    private string $tokenHash;
    private string $expiresAt;
    private string $createdAt;
    private ?string $revokedAt;

    public function __construct(
        int $sessionId,
        int $userId,
        string $tokenHash,
        string $expiresAt,
        string $createdAt,
        ?string $revokedAt,
    ) {
        $this->sessionId = $sessionId;
        $this->userId = $userId;
        $this->tokenHash = $tokenHash;
        $this->expiresAt = $expiresAt;
        $this->createdAt = $createdAt;
        $this->revokedAt = $revokedAt;
    }

    public function getSessionId(): int
    {
        return $this->sessionId;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getTokenHash(): string
    {
        return $this->tokenHash;
    }

    public function getExpiresAt(): string
    {
        return $this->expiresAt;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getRevokedAt(): ?string
    {
        return $this->revokedAt;
    }
}
