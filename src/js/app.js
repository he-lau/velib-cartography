import { initMap, renderPopUpContent, initSideBar } from "../../modules/map.js";
import { getUserCoordonnees, isCheckboxChecked } from "../../modules/utils.js";
import {
  insertVelibLogs,
  findNearestStation,
} from "../../modules/serverQuery.js";
import { initRouting, updateRouting } from "../../modules/routing.js";

import {
  BASE_URL,
  userPosIcon,
  bikeIcon,
  startIcon,
  endIcon,
  intervalInMilliseconds,
} from "./const.js";

let map;

let mapInitialized = false;
let getUserLocation = false;

let userPositionMarker;
let userLocation = {};

let markers = L.markerClusterGroup();

const initStationsOnTheMap = async () => {
  try {
    // Appel de la fonction getUserCoordonnees de manière asynchrone
    await getUserCoordonnees()
      .then((location) => {
        //console.log('test', location.lon);

        userLocation = location;

        if (!mapInitialized) {
          // init leaflet map
          //map = initMap('map',location.lat,location.lon);
          map = initMap("map", location.lat, location.lon);
          mapInitialized = true;
          getUserLocation = true;
        }

        // Créez un marqueur par défaut de Leaflet
        userPositionMarker = L.marker([location.lat, location.lon], {
          icon: userPosIcon,
        });

        //userPositionMarker._icon.style.color = 'red';

        userPositionMarker.bindPopup("User location");
        //markers.addLayer(userPositionMarker);
        userPositionMarker.addTo(map);

        //indexOfUserLocationMarker = userPositionMarker._leaflet_id;
      }) // reject
      .catch((error) => {
        console.error(error);
      });

    if (!mapInitialized) {
      //console.log('mapInitialized',mapInitialized);
      // init leaflet map
      map = initMap("map", 48.833314, 0.3520025);
    }

    const response = await fetch(BASE_URL + "/exports/json");
    const text = await response.text();

    let data = await JSON.parse(text);
    console.log(data);

    data.forEach((element) => {
      if (element !== null) {
        if (element["coordonnees_geo"] !== null) {
          if (
            element["coordonnees_geo"]["lon"] !== null &&
            element["coordonnees_geo"]["lat"] !== null
          ) {
            // Logs
            insertVelibLogs("php/insertVelibLogs.php", element);

            let stationcode = element["stationcode"];
            let coordonnees_geo = element["coordonnees_geo"];
            let lon = coordonnees_geo["lon"];
            let lat = coordonnees_geo["lat"];
            let capacity = element["capacity"];
            let duedate = element["duedate"];
            let ebike = element["ebike"];
            let is_installed = element["is_installed"];
            let is_renting = element["is_renting"];
            let is_returning = element["is_returning"];
            let mechanical = element["mechanical"];
            let name = element["name"];
            let nom_arrondissement_communes =
              element["nom_arrondissement_communes"];
            let numbikesavailable = element["numbikesavailable"];
            let numdocksavailable = element["numdocksavailable"];

            //console.log("stationcode : ", stationcode);
            //console.log("coordonnees_geo : ", coordonnees_geo);

            // Créez un popup avec des informations de station.
            let popupContent = renderPopUpContent(
              name,
              duedate,
              capacity,
              numdocksavailable,
              numbikesavailable,
              ebike,
              mechanical
            );

            // sauvegarder les meta datas
            let marker = L.marker([lat, lon], {
              icon: bikeIcon,
              stationcode: stationcode,
              name: name,
              duedate: duedate,
              capacity: capacity,
              numdocksavailable: numdocksavailable,
              numbikesavailable: numbikesavailable,
              ebike: ebike,
              mechanical: mechanical,
              is_installed: is_installed,
              is_renting: is_renting,
              is_returning: is_returning,
              nom_arrondissement_communes: nom_arrondissement_communes,
            });
            marker.bindPopup(popupContent);

            markers.addLayer(marker); // Ajoutez le marqueur au groupe de clusters.
          }
        }
      }
    });

    // IMPORTANT
    map.addLayer(markers); // Add the cluster group to the map.
  } catch (e) {
    console.error(e);
  }
};

const updateMarkerProperties = (marker, element) => {
  // MAJ popup
  marker.setPopupContent(
    renderPopUpContent(
      element.name,
      element.duedate,
      element.capacity,
      element.numdocksavailable,
      element.numbikesavailable,
      element.ebike,
      element.mechanical
    )
  );

  // MAJ metadata du marqueuer
  marker.options.duedate = element.duedate;

  marker.options.numbikesavailable = element.numbikesavailable;
  marker.options.numdocksavailable = element.numdocksavailable;

  marker.options.ebike = element.ebike;
  marker.options.mechanical = element.mechanical;

  marker.options.capacity = element.capacity;

  marker.options.is_installed = element.is_installed;
  marker.options.is_renting = element.is_renting;
  marker.options.is_returning = element.is_returning;

  // log
  insertVelibLogs("php/insertVelibLogs.php", element);
};

const refreshMap = async () => {
  // requête à l'api pour avoir les données à jour
  const response = await fetch(BASE_URL + "/exports/json");
  const text = await response.text();

  let data = await JSON.parse(text);

  //console.log(data);
  //console.log("markers clusters",markers);

  // liste des stations
  let listeMarqueurs = markers.getLayers();

  //console.log("markers list",listeMarqueurs);
  //console.log("first marker : ",listeMarqueurs[0]);
  //console.log("first marker option : ",listeMarqueurs[0]['options']);

  // compteur pour le nombre de station maj
  let updatedCount = 0;

  data.forEach((element) => {
    let coordonnees_geo = element["coordonnees_geo"];
    let lon = coordonnees_geo["lon"];
    let lat = coordonnees_geo["lat"];

    // (il arrive que l'api retourne des valeurs null), embêtant si position null pour l'insertion si la station non init
    if (lon !== null && lat !== null) {
      // Logs
      //insertVelibLogs("php/insertVelibLogs.php",element);

      let stationcode = element["stationcode"];

      let capacity = element["capacity"];
      let duedate = element["duedate"];
      let ebike = element["ebike"];
      let is_installed = element["is_installed"];
      let is_renting = element["is_renting"];
      let is_returning = element["is_returning"];
      let mechanical = element["mechanical"];
      let name = element["name"];
      let nom_arrondissement_communes = element["nom_arrondissement_communes"];
      let numbikesavailable = element["numbikesavailable"];
      let numdocksavailable = element["numdocksavailable"];

      //  le marqueur lié à l'element courant
      const markerOfcurrentElement = listeMarqueurs.find(
        (element) => element["options"]["stationcode"] === stationcode
      );
      // indice du marqueur au sein de leaflet
      const indexOfMarker = listeMarqueurs.indexOf(markerOfcurrentElement);
      // le marqueur à changer
      const markerToChange = listeMarqueurs[indexOfMarker];

      //console.log("indexOfMarker", indexOfMarker);
      //console.log('marker finded',markerOfcurrentElement);
      //console.log("marker to change", markerToChange);
      //console.log("marker to change 22222222", listeMarqueurs[indexOfMarker]);

      //console.log('BBBB', map);
      //const markerToChange = map._layers[markerId];

      //console.log("station courante",stationcode);
      //console.log("indice du courant",indexOfMarkerOfcurrentElement);

      let avant = Object.assign({}, markerOfcurrentElement["options"]);

      // comparer les metadatas (options) & ssi different : maj vue
      if (capacity !== markerOfcurrentElement["options"]["capacity"]) {
        console.log("capacity changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);
        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else if (duedate !== markerOfcurrentElement["options"]["duedate"]) {
        console.log("duedate changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);

        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else if (ebike !== markerOfcurrentElement["options"]["ebike"]) {
        console.log("ebike changed !" + " - " + name);

        console.log("avant : ", avant, "après : ", element);
        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else if (
        mechanical !== markerOfcurrentElement["options"]["mechanical"]
      ) {
        console.log("mechanical changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);
        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else if (
        numbikesavailable !==
        markerOfcurrentElement["options"]["numbikesavailable"]
      ) {
        console.log("numbikesavailable changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);
        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else if (
        numdocksavailable !==
        markerOfcurrentElement["options"]["numdocksavailable"]
      ) {
        console.log("numdocksavailable changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);
        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else if (
        is_installed !== markerOfcurrentElement["options"]["is_installed"]
      ) {
        console.log("is_installed changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);
        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else if (
        is_renting !== markerOfcurrentElement["options"]["is_renting"]
      ) {
        console.log("is_renting changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);
        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else if (
        is_returning !== markerOfcurrentElement["options"]["is_returning"]
      ) {
        console.log("is_returning changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);
        updateMarkerProperties(markerToChange, element);
        updatedCount++;
      } else {
        console.log("Station à jour, pas de changement.");
      }
    }
  });

  return { updatedCount: updatedCount };
};

// Main

let initMain = false;

function main() {
  //markers.clearLayers();

  if (!initMain) {
    initStationsOnTheMap().then(() => {
      let sidebar = initSideBar(map);

      console.log("FIN initStationsOnTheMap");
      let listeMarqueurs = markers.getLayers();

      console.log(listeMarqueurs);

      let routing = initRouting("bike", "fr", startIcon, endIcon);

      routing.addTo(map);

      // container de l'interface de routing
      let leafletRoutingContainer = document.querySelector(
        ".leaflet-routing-container"
      );

      // listener
      /**
       *  Si un itinéraire valide est choisit :
       *  - verifier check de "Déposer mon vélo"
       *    - true : trouver la station avec un dock vide le plus proche de la destination
       *
       *
       *  */

      routing.on("routeselected", function (e) {
        console.log("Route selected:", e.route);

        // "Déposer mon vélo"
        if (isCheckboxChecked("settings-drop-off-velib")) {
          // Les waypoints qui compose le traet : label + position (lat,lon)
          let actualWaypoints = e.route.actualWaypoints;
          console.log("WWWWWWWWWWWWWWWWWw:", actualWaypoints);
          // On recupere la destination finale
          let finalDestination = actualWaypoints[actualWaypoints.length - 1];

          console.log("PPPPPPPPPPPPPPPP", markers.getLayers());
          console.log("OOOOOOOOOOOOOOOOOOOOO", finalDestination);

          // Requête au serveur pour recuperer l'id du marqueur de la station la plus proche de la destination
          let findNearestStationQuery = findNearestStation(
            "php/findNearestStation.php",
            markers.getLayers(),
            finalDestination.latLng
          ).then((response) => {
            console.log("findNearestStationQuery", response);

            // recuperer seulement les coordonnées des waypoints pour MAJ le routing
            var marqueurSpecifique = markers.getLayer(
              response["nearestSationID"]
            );

            let actualWaypointsPosOnly = actualWaypoints.map(
              (waypoint) => waypoint.latLng
            );
            console.log("TEST1", Object.assign({}, actualWaypointsPosOnly));

            // Vérifiez si le marqueur a été trouvé.
            if (marqueurSpecifique) {
              actualWaypointsPosOnly.splice(
                actualWaypointsPosOnly.length - 1,
                0,
                marqueurSpecifique.getLatLng()
              );

              console.log("TEST2", actualWaypointsPosOnly);

              updateRouting(routing, "bike", "fr", actualWaypointsPosOnly);
              // ouvrir popup
              marqueurSpecifique.openPopup();
            } else {
              alert("Station non trouvé");
            }
          });

          // IMPORTANT : SINON call api en boucle (trigger de routeselected) !!!!!!!!!!!!!!!
          // + blocké par l'API de nominatim :c (tentative de DDOS)

          // changer l'etat du checkbox
          let checkbox = document.getElementById("settings-drop-off-velib");
          checkbox.checked = !checkbox.checked;
        } else {
          console.log("Pas d'options sélectionnées");
        }
      });

      // Add an event listener to the control to handle the geocoding results
      routing.on("geocoderequest", function (e) {
        console.log("Geocode request:", e);
      });

      routing.on("routingupdateend", function () {
        console.log("Routing update completed");
      });
    });

    initMain = true;
  } else {
    console.log("Refresh map...");

    refreshMap()
      .then((o) => {
        /**
         * Alert pour la maj des stations
         *
         */

        //alert(o.updatedCount + " station(s) mis à jour.");
        var alertElement = document.getElementById("alert");

        if (o.updatedCount > 0) {
          // afficher l'alert
          alertElement.classList.add("alert-success");
          alertElement.classList.remove("alert-info");
          alertElement.classList.remove("d-none");

          // changer le text
          //alertElement.innerText = o.updatedCount + " station(s) mis à jour"; // Change the inner text
          alertElement.innerHTML =
            '<span style="font-size: larger; font-weight: bold;">' +
            o.updatedCount +
            " station(s) mis à jour</span>";
        } else {
          // afficher l'alert
          alertElement.classList.remove("alert-success");
          alertElement.classList.add("alert-info");
          alertElement.classList.remove("d-none");

          // changer le text
          //alertElement.innerText = "Carte à jour."; // Change the inner text
          alertElement.innerHTML =
            '<span style="font-size: larger; font-weight: bold;">' +
            "Carte à jour" +
            "</span>";
          //alert("Carte à jour.")
        }

        // retirer
        setTimeout(function () {
          alertElement.classList.add("d-none");
        }, 4000);
      })
      .then(() => {
        /**
         * TODO : MAJ position de l'utilisateur
         */
        console.log("Update user position...");

        getUserCoordonnees().then((position) => {
          console.log("User current position", position);
        });
      });
  }
}

main();

setInterval(main, intervalInMilliseconds);

// Listeners

// Au clique recuperer l'id du marqueuer le plus proche de l'utilisateur
// --> se deplacer sur la station + ouvrir popup

document.addEventListener("DOMContentLoaded", function () {
  const nearestStationBtn = document.getElementById("nearest-station-btn");

  nearestStationBtn.addEventListener("click", function () {
    let a = findNearestStation(
      "php/findNearestStation.php",
      markers.getLayers(),
      userPositionMarker.getLatLng(),
      false
    ).then((response) => {
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
}); // DOM

import "./listeners/dataviz.js";
