<?php

require_once "init.php";

// Récupérer la méthode HTTP utilisée
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // body requete
    $json_data = file_get_contents("php://input");
    // array
    $data = json_decode($json_data, true);




    // verifier si la station est déjà indexée
    $find_station_sql = "SELECT stationcode FROM " . STATION_TABLE . " WHERE stationcode = :stationcode";

    $stmt_find_station = $db->prepare($find_station_sql);
    $stmt_find_station->bindParam(':stationcode', $data['stationcode'], PDO::PARAM_INT);
    $stmt_find_station->execute();

    $find_station = $stmt_find_station->fetch(PDO::FETCH_ASSOC);

    $insert_velib_logs_sql = "INSERT INTO " . LOGS_TABLE . " 
    (capacity, stationcode,  duedate, ebike, is_installed, is_renting, is_returning, mechanical,  numbikesavailable, numdocksavailable)
    VALUES
    (:capacity, :stationcode,:duedate, :ebike, :is_installed, :is_renting, :is_returning, :mechanical,  :numbikesavailable, :numdocksavailable)";


    if ($find_station) {
        // insertion log

        // Prepare the statement
        $stmt = $db->prepare($insert_velib_logs_sql);

        // Bind values
        $stmt->bindParam(':capacity', $data['capacity'], PDO::PARAM_INT);
        $stmt->bindParam(':stationcode', $data['stationcode'], PDO::PARAM_INT);

        $stmt->bindParam(':duedate', $data['duedate'], PDO::PARAM_STR);
        $stmt->bindParam(':ebike', $data['ebike'], PDO::PARAM_INT);
        $stmt->bindParam(':is_installed', $data['is_installed'], PDO::PARAM_INT);
        $stmt->bindParam(':is_renting', $data['is_renting'], PDO::PARAM_INT);
        $stmt->bindParam(':is_returning', $data['is_returning'], PDO::PARAM_INT);
        $stmt->bindParam(':mechanical', $data['mechanical'], PDO::PARAM_INT);

        $stmt->bindParam(':numbikesavailable', $data['numbikesavailable'], PDO::PARAM_INT);
        $stmt->bindParam(':numdocksavailable', $data['numdocksavailable'], PDO::PARAM_INT);
    } else {
        // TODO : indexer la station + insertion log
        $insert_station = "INSERT INTO " . STATION_TABLE . " (stationcode, name, nom_arrondissement_communes, lon, lat) 
        VALUES (:stationcode, :name, :nom_arrondissement_communes, :lon, :lat)";

        // Prepare the statement for station insertion
        $stmt_insert_station = $db->prepare($insert_station);

        // Bind values for station insertion
        $stmt_insert_station->bindParam(':stationcode', $data['stationcode'], PDO::PARAM_INT);
        $stmt_insert_station->bindParam(':name', $data['name'], PDO::PARAM_STR);
        $stmt_insert_station->bindParam(':nom_arrondissement_communes', $data['nom_arrondissement_communes'], PDO::PARAM_STR);
        $stmt_insert_station->bindParam(':lon', $data['coordonnees_geo']['lon'], PDO::PARAM_STR);
        $stmt_insert_station->bindParam(':lat', $data['coordonnees_geo']['lat'], PDO::PARAM_STR);

        // Execute the station insertion statement
        $stmt_insert_station->execute();

        // Prepare the statement
        $stmt = $db->prepare($insert_velib_logs_sql);

        // Bind values
        $stmt->bindParam(':capacity', $data['capacity'], PDO::PARAM_INT);
        $stmt->bindParam(':stationcode', $data['stationcode'], PDO::PARAM_INT);

        $stmt->bindParam(':duedate', $data['duedate'], PDO::PARAM_STR);
        $stmt->bindParam(':ebike', $data['ebike'], PDO::PARAM_INT);
        $stmt->bindParam(':is_installed', $data['is_installed'], PDO::PARAM_INT);
        $stmt->bindParam(':is_renting', $data['is_renting'], PDO::PARAM_INT);
        $stmt->bindParam(':is_returning', $data['is_returning'], PDO::PARAM_INT);
        $stmt->bindParam(':mechanical', $data['mechanical'], PDO::PARAM_INT);

        $stmt->bindParam(':numbikesavailable', $data['numbikesavailable'], PDO::PARAM_INT);
        $stmt->bindParam(':numdocksavailable', $data['numdocksavailable'], PDO::PARAM_INT);
    }





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
