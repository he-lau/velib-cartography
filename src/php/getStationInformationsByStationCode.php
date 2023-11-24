<?php

/**
 * 
 * TODO :
 * 1 - Récuperer tous les tuples pour un stationcode donné par le client
 * 2 - Retour au client de la liste des infos de la station demandée
 */

require_once "init.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {

    $stationcode = htmlspecialchars($_GET['stationcode']);

    $table = VELIB_LOGS;

    // 
    $sql = "SELECT * FROM $table WHERE stationcode=:stationcode";

    $stmt = $db->prepare($sql);

    $stmt->bindParam(':stationcode', $stationcode);

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
    http_response_code(400);
    echo json_encode(array("message" => "erreur requete"));
}
