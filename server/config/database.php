<?php

declare(strict_types=1);

class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection === null) {
            $host = $_ENV["DB_HOST"] ?? $_ENV["DB_HOSTNAME"] ?? "127.0.0.1";
            $port = $_ENV["DB_PORT"] ?? "3306";
            $database = $_ENV["DB_NAME"] ?? $_ENV["DB_DATABASE"] ?? $_ENV["DB_SCHEMA"] ?? "schedulix";
            $username = $_ENV["DB_USER"] ?? $_ENV["DB_USERNAME"] ?? "root";
            $password = $_ENV["DB_PASSWORD"] ?? $_ENV["DB_PASS"] ?? "";

            $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";

            self::$connection = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        }

        return self::$connection;
    }
}
