<?php

declare(strict_types=1);

const AUTH_COOKIE_NAME = "schedulix_session";

const AUTH_NORMAL_SESSION_HOURS = 8;
const AUTH_REMEMBER_SESSION_DAYS = 30;

const AUTH_COOKIE_PATH = "/";

/*
 * Development:
 * false because localhost is HTTP.
 *
 * Production:
 * true because the application must use HTTPS.
 */
const AUTH_COOKIE_SECURE = false;

const AUTH_COOKIE_HTTP_ONLY = true;

/*
 * React and PHP are both running under localhost during development,
 * so Lax works well here.
 *
 * If frontend and backend are deployed on different sites,
 * use SameSite=None + Secure HTTPS.
 */
const AUTH_COOKIE_SAME_SITE = "Lax";
