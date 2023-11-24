<?php

/**
 * 
 * TODO :
 * 1 - Récuperer distinctement l'ensemble des stations (stationcode + name)
 * 2 - Retour au client 
 */

require_once "init.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {

    $table = VELIB_LOGS;

    $sql = "SELECT DISTINCT stationcode, name FROM $table WHERE name IS NOT NULL";

    $stmt = $db->prepare($sql);

    if ($stmt->execute()) {

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200); // 200 OK
        echo json_encode(array(
            'code' => 200,
            'message' => 'Fetch OK',
            'stations' => $result
        ));
    } else {
        // Error in execution
        http_response_code(500); // 500 Internal Server Error
        echo json_encode(array(
            'code' => 500,
            'message' => 'Internal Server Error'
        ));
    }
} else {
    // Autres méthodes non prises en charge
    http_response_code(405); // 405 Method Not Allowed
    echo json_encode(array("message" => "Insertion ERROR"));
}
