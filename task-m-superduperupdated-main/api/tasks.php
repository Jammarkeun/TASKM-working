<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../api/Task.php';

$database = new Database();
$db = $database->getConnection();
$task = new Task($db);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();
        $task->user_id = $user_id;
        $stmt = $task->read();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $tasks_arr = ["records" => []];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $task_item = [
                    "id" => $id,
                    "title" => $title,
                    "description" => $description,
                    "status" => $status,
                    "due_date" => $due_date,
                    "created_at" => $created_at
                ];
                array_push($tasks_arr["records"], $task_item);
            }
            http_response_code(200);
            echo json_encode($tasks_arr);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No tasks found."]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->title) && !empty($data->description) && !empty($data->user_id)) {
            $task->title = $data->title;
            $task->description = $data->description;
            $task->user_id = $data->user_id;
            $task->status = $data->status ?? 'pending';
            $task->due_date = $data->due_date ?? null;

            if ($task->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Task was created."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create task."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Unable to create task. Data is incomplete."]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->id)) {
            $task->id = $data->id;

            if($task->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Task was deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete task."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to delete task. No ID provided."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}