<?php

require_once "init.php";

// Récupérer la méthode HTTP utilisée
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // body requete
    $json_data = file_get_contents("php://input");
    // array
    $data = json_decode($json_data, true);

    // TODO : Insérer les données dans la table des logs

    // Prepare the SQL query
    $insert_velib_logs_sql = "INSERT INTO " . VELIB_LOGS . " 
    (capacity, stationcode, lon, lat, duedate, ebike, is_installed, is_renting, is_returning, mechanical, name, nom_arrondissement_communes, numbikesavailable, numdocksavailable)
    VALUES
    (:capacity, :stationcode, :lon, :lat, :duedate, :ebike, :is_installed, :is_renting, :is_returning, :mechanical, :name, :nom_arrondissement_communes, :numbikesavailable, :numdocksavailable)";

    // Prepare the statement
    $stmt = $db->prepare($insert_velib_logs_sql);

    // Bind values
    $stmt->bindParam(':capacity', $data['capacity'], PDO::PARAM_INT);
    $stmt->bindParam(':stationcode', $data['stationcode'], PDO::PARAM_INT);
    $stmt->bindParam(':lon', $data['coordonnees_geo']['lon'], PDO::PARAM_STR);
    $stmt->bindParam(':lat', $data['coordonnees_geo']['lat'], PDO::PARAM_STR);
    $stmt->bindParam(':duedate', $data['duedate'], PDO::PARAM_STR);
    $stmt->bindParam(':ebike', $data['ebike'], PDO::PARAM_INT);
    $stmt->bindParam(':is_installed', $data['is_installed'], PDO::PARAM_INT);
    $stmt->bindParam(':is_renting', $data['is_renting'], PDO::PARAM_INT);
    $stmt->bindParam(':is_returning', $data['is_returning'], PDO::PARAM_INT);
    $stmt->bindParam(':mechanical', $data['mechanical'], PDO::PARAM_INT);
    $stmt->bindParam(':name', $data['name'], PDO::PARAM_STR);
    $stmt->bindParam(':nom_arrondissement_communes', $data['nom_arrondissement_communes'], PDO::PARAM_STR);
    $stmt->bindParam(':numbikesavailable', $data['numbikesavailable'], PDO::PARAM_INT);
    $stmt->bindParam(':numdocksavailable', $data['numdocksavailable'], PDO::PARAM_INT);

    // Execute the statement
    if ($stmt->execute()) {
        // Insertion successful
        http_response_code(201); // 201 Created
        echo json_encode(array(
            'code' => 201,
            "message" => "Insertion OK"
        ));
    } else {
        // Error handling for failed insertion
        http_response_code(500); // 500 Internal Server Error
        echo json_encode(array("message" => "Insertion failed"));
    }
} else {
    http_response_code(405); // 405 Method Not Allowed
    echo json_encode(array("message" => "Insertion ERROR"));
}
