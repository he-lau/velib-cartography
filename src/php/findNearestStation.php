<?php

/**
 * 
 * TODO : 
 *  1 - parcourrir l'ensemble des marqueuers et recuperer leurs positions
 *  2 - choisir une solution métier :
 *      - vol d'oiseau ?
 *      - Djisktra, A* ... :
 *          - PROBLEME : acces au cout (routes)
 *      - Utiliser une API de routing pour avoir l'estimation de temps/ distance
 *          - PROBLEME : call API important !!
 * 
 *  3 - reponse au client 
 */

require_once "init.php";

// Récupérer la méthode HTTP utilisée
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {

    //$stations_markers = $data['stationsMarkers'];

    // body requete
    $json_data = file_get_contents("php://input");
    // array
    $data = json_decode($json_data, true);

    http_response_code(200); // ok
    echo json_encode(array(
        'code' => 200,
        "message" => "OK",
        "data" => $data['stationsMarkers']
    ));
}
