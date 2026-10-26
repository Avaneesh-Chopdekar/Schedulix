<?php

declare(strict_types=1);

require_once __DIR__ . "/../config/database.php";

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class TeacherAbsenceController
{
    public function list(Request $request, Response $response): Response
    {
        $db = Database::getConnection();
        $query = $request->getQueryParams();
        $from = $query["from"] ?? date("Y-m-d");
        $to = $query["to"] ?? date("Y-m-d", strtotime("+1 day"));
        $stmt = $db->prepare(
            "SELECT ta.absence_id, ta.teacher_id, ta.absence_date, ta.reason,
                    ta.created_at, t.employee_id, u.first_name, u.last_name
             FROM teacher_absences ta
             INNER JOIN teachers t ON t.teacher_id = ta.teacher_id
             INNER JOIN users u ON u.user_id = t.user_id
             WHERE ta.absence_date BETWEEN :from_date AND :to_date
             ORDER BY ta.absence_date, u.first_name, u.last_name"
        );
        $stmt->execute(["from_date" => $from, "to_date" => $to]);
        return $this->json($response, $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function create(Request $request, Response $response): Response
    {
        $authUser = $request->getAttribute("authUser");
        $data = $request->getParsedBody();
        if (!is_array($authUser) || !is_array($data)) {
            return $this->json($response, null, 400, "Invalid request.");
        }
        $date = (string) ($data["absence_date"] ?? "");
        $today = date("Y-m-d");
        $tomorrow = date("Y-m-d", strtotime("+1 day"));
        if (!in_array($date, [$today, $tomorrow], true)) {
            return $this->json($response, null, 400, "You can mark absent only for today or tomorrow.");
        }
        $db = Database::getConnection();
        $teacher = $db->prepare("SELECT teacher_id FROM teachers WHERE user_id = :user_id");
        $teacher->execute(["user_id" => (int) $authUser["user_id"]]);
        $teacherId = $teacher->fetchColumn();
        if (!$teacherId) {
            return $this->json($response, null, 403, "Faculty profile not found.");
        }
        $stmt = $db->prepare(
            "INSERT INTO teacher_absences (teacher_id, absence_date, reason)
             VALUES (:teacher_id, :absence_date, :reason)
             ON DUPLICATE KEY UPDATE reason = VALUES(reason)"
        );
        $stmt->execute([
            "teacher_id" => (int) $teacherId,
            "absence_date" => $date,
            "reason" => trim((string) ($data["reason"] ?? "")) ?: null,
        ]);
        return $this->json($response, ["absence_date" => $date], 201);
    }

    private function json(Response $response, mixed $data, int $status = 200, ?string $message = null): Response
    {
        $response->getBody()->write(json_encode(["success" => $status < 400, "data" => $data, "message" => $message]));
        return $response->withHeader("Content-Type", "application/json")->withStatus($status);
    }
}
