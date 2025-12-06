<?php 
include "../../../conn.php";

$response = [];

if ($conn) {
    $id = isset($_POST['id']) ? $_POST['id'] : null;

    if ($id !== null) {
        $stmt = $conn->prepare("SELECT * FROM user_details WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            header("Content-Type: application/json");

            while ($row = $result->fetch_assoc()) {
                $response= $row;
            }

            echo json_encode($response, JSON_PRETTY_PRINT);
        } else {  
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch user details']);
        }

        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Missing user ID']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
}
?>