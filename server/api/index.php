<?php

declare(strict_types=1);

require __DIR__ . "/../vendor/autoload.php";

use Slim\Factory\AppFactory;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/..");

$dotenv->load();

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

require __DIR__ . "/routes.php";

$app->addErrorMiddleware(true, true, true);

$app->run();

