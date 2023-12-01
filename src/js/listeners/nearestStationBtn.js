import { findNearestStation } from "../../../modules/serverQuery.js";

// Listeners

// TODO : au clique recuperer l'id du marqueuer le plus proche de l'utilisateur
// --> se deplacer sur la station + ouvrir popup

document.addEventListener("DOMContentLoaded", function () {
  const nearestStationBtn = document.getElementById("nearest-station-btn");

  nearestStationBtn.addEventListener("click", function () {
    console.log("Button clicked!");
    //console.error("aa");

    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa", markers);
    console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb", userPositionMarker.getLatLng());

    let a = findNearestStation(
      "php/findNearestStation.php",
      markers.getLayers(),
      userPositionMarker.getLatLng(),
      false
    ).then((response) => {
      console.log("AAAAAAAAAAAAAAAA", response);

      // Utilisez la méthode getLayer pour obtenir la couche du marqueur.
      var marqueurSpecifique = markers.getLayer(response["nearestSationID"]);

      // Vérifiez si le marqueur a été trouvé.
      if (marqueurSpecifique) {
        // coordonnées du marqueur.
        var latLng = marqueurSpecifique.getLatLng();

        // aller à la station
        map.flyTo(latLng, 20);

        // ouvrir popup
        marqueurSpecifique.openPopup();
      }
    });
  });

  // Récupérer l'élément checkbox
  let checkbox = document.getElementById("settings-drop-off-velib");

  // Vérifier si la checkbox a été trouvée
  if (checkbox) {
    // Ajouter l'écouteur d'événements uniquement si la checkbox est trouvée
    checkbox.addEventListener("change", function () {
      console.log("changggggggggge");
    });
  } else {
    console.error(
      "La checkbox avec l'ID 'settings-drop-off-velib' n'a pas été trouvée."
    );
  }
}); // DOM
