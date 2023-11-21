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




// TODO : Formule de haversine

function haversine($lat1, $lon1, $lat2, $lon2)
{
    // Convertir les degrés en radians
    $lat1 = deg2rad($lat1);
    $lon1 = deg2rad($lon1);
    $lat2 = deg2rad($lat2);
    $lon2 = deg2rad($lon2);

    // Calculer la différence de latitude et de longitude
    $dlat = $lat2 - $lat1;
    $dlon = $lon2 - $lon1;

    // Formule de la haversine
    $a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlon / 2) * sin($dlon / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    // Rayon de la Terre en kilomètres (approximatif)
    $radius = EARTH_RADIUS;

    // Calculer la distance
    $distance = $radius * $c;

    return $distance;
}


// Récupérer la méthode HTTP utilisée
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {

    //$stations_markers = $data['stationsMarkers'];

    // body requete
    $json_data = file_get_contents("php://input");
    // array
    $data = json_decode($json_data, true);

    //
    $initial_pos_lat = $data['initialPos']['lat'];
    $initial_pos_lng = $data['initialPos']['lng'];


    // A determiner
    $nearest_leaflet_id = $data['stationsMarkers'][0]['leaflet_id'];
    $nearest_distance_between_initial = haversine($initial_pos_lat, $initial_pos_lng, $data['stationsMarkers'][0]['latlng']['lat'], $data['stationsMarkers'][0]['latlng']['lng']);

    // Parcourrir l'ensemble des stations
    $count = count($data['stationsMarkers']);

    for ($i = 1; $i < $count; $i++) {
        $station = $data['stationsMarkers'][$i];
        // si la distance est plus courte 

        $current_distance_between_initial = haversine($initial_pos_lat, $initial_pos_lng, $station['latlng']['lat'], $station['latlng']['lng']);


        if ($current_distance_between_initial < $nearest_distance_between_initial) {
            $nearest_distance_between_initial = $current_distance_between_initial;
            $nearest_leaflet_id = $station['leaflet_id'];
        }
    }



    http_response_code(200); // ok
    echo json_encode(array(
        'code' => 200,
        "message" => "OK",
        "stationsMarkers" => $data['stationsMarkers'][0],
        "initialPos" => $data['initialPos'],
        "nearestSationID" => $nearest_leaflet_id,
        "nearestDistance" => $nearest_distance_between_initial,
    ));
}
