<?php

declare(strict_types=1);

class User
{
    private int $userId;
    private string $firstName;
    private string $lastName;
    private string $email;
    private string $mobileNumber;
    private string $passwordHash;
    private string $role;
    private bool $isActive;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(
        int $userId,
        string $firstName,
        string $lastName,
        string $email,
        string $mobileNumber,
        string $passwordHash,
        string $role,
        bool $isActive,
        string $createdAt,
        string $updatedAt,
    ) {
        $this->userId = $userId;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->email = $email;
        $this->mobileNumber = $mobileNumber;
        $this->passwordHash = $passwordHash;
        $this->role = $role;
        $this->isActive = $isActive;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getMobileNumber(): string
    {
        return $this->mobileNumber;
    }

    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }
}
