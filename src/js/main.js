import {
  initMap,
  getUserCoordonnees,
  renderPopUpContent,
  insertVelibLogs,
  createRouting,
  initRouting,
  updateRouting,
  initSideBar,
  findNearestStation,
  isCheckboxChecked
} from "../../modules/script.js";

const BASE_URL =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

let map;

let mapInitialized = false;
let getUserLocation = false;
let leafletIdOfUserLocationMarker = -1;

let userPositionMarker;

let markers = L.markerClusterGroup();

// variable pour garder en mémoire l'indice des markers
let indexOfMarkers = [];









const initStationsOnTheMap = async () => {
  let userLocation = {};

  try {
    // Appel de la fonction getUserCoordonnees de manière asynchrone
    await getUserCoordonnees()
      .then((location) => {
        //console.log('test', location.lon);

        if (!mapInitialized) {
          // init leaflet map
          //map = initMap('map',location.lat,location.lon);
          map = initMap("map", location.lat, location.lon);
          mapInitialized = true;
          getUserLocation = true;
        }

        // ajout du marqueur à la liste des marqueurs
        /*
                let userPositionMarker = L.marker([location.lat, location.lon], {
                    icon: L.divIcon({
                        className: 'user-position-marker', 
                        html: '<i class="fas fa-map-marker-alt" style="color: red;font-size:32px"></i>', 
                        iconSize: [24, 24] // Taille personnalisée du marqueur en pixels (largeur, hauteur)
                    })
                });
                */
        // Créez un marqueur par défaut de Leaflet
        userPositionMarker = L.marker([location.lat, location.lon], {
          icon: redIcon,
        });


        //userPositionMarker._icon.style.color = 'red';

        userPositionMarker.bindPopup("User location");
        //markers.addLayer(userPositionMarker);
        userPositionMarker.addTo(map);
        
/*
        userPositionMarker.on('add', function() {
            // Accédez à l'_leaflet_id après que le marqueur a été ajouté
            //console.log('Leaflet ID:', userPositionMarker._leaflet_id);
            leafletIdOfUserLocationMarker = userPositionMarker._leaflet_id;
        });
*/
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

            //placer la station courante sur la carte
            /*
let marker = L.marker([lon, lat])
.addTo(map)
.bindPopup('bindPopup()')
.openPopup();
*/

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

            // TODO : sauvegarder les meta datas
            let marker = L.marker([lat, lon], {
              stationcode: stationcode,
              name: name,
              duedate: duedate,
              capacity: capacity,
              numdocksavailable: numdocksavailable,
              numbikesavailable: numbikesavailable,
              ebike: ebike,
              mechanical: mechanical,
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

const refreshMap = async () => {
  const response = await fetch(BASE_URL + "/exports/json");
  const text = await response.text();

  let data = await JSON.parse(text);

  //console.log(data);

  //console.log("markers clusters",markers);

  let listeMarqueurs = markers.getLayers();

  //console.log("markers list",listeMarqueurs);

  //console.log("first marker : ",listeMarqueurs[0]);
  //console.log("first marker option : ",listeMarqueurs[0]['options']);

  let updatedCount = 0;

  data.forEach((element) => {
    let coordonnees_geo = element["coordonnees_geo"];
    let lon = coordonnees_geo["lon"];
    let lat = coordonnees_geo["lat"];

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

      //console.log('indexOfMarker',indexOfMarker);
      //console.log('marker finded',markerOfcurrentElement);
      //console.log('marker to change',markerToChange);

      //console.log('BBBB', map);
      //const markerToChange = map._layers[markerId];

      //console.log("station courante",stationcode);
      //console.log("indice du courant",indexOfMarkerOfcurrentElement);

      const newOptions = {
        stationcode: stationcode,
        name: name,
        duedate: duedate,
        capacity: capacity,
        numdocksavailable: numdocksavailable,
        numbikesavailable: numbikesavailable,
        ebike: ebike,
        mechanical: mechanical,
      };

      let avant = Object.assign({}, markerOfcurrentElement["options"]);

      // comparer les metadatas (options) & ssi different : maj vue
      if (capacity !== markerOfcurrentElement["options"]["capacity"]) {
        console.log("capacity changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);

        // changer la popup
        listeMarqueurs[indexOfMarker].setPopupContent(
          renderPopUpContent(
            name,
            duedate,
            capacity,
            numdocksavailable,
            numbikesavailable,
            ebike,
            mechanical
          )
        );
        // IMPORTANT : MAJ des 'options' de l'ancien marqueur
        //listeMarqueurs[indexOfMarker].options.name = name;
        listeMarqueurs[indexOfMarker].options.duedate = duedate;
        //listeMarqueurs[indexOfMarker].options.capacity = capacity;
        listeMarqueurs[indexOfMarker].options.numbikesavailable =
          numbikesavailable;
        listeMarqueurs[indexOfMarker].options.numdocksavailable =
          numdocksavailable;
        listeMarqueurs[indexOfMarker].options.ebike = ebike;
        listeMarqueurs[indexOfMarker].options.mechanical = mechanical;

        insertVelibLogs("php/insertVelibLogs.php", element);
        updatedCount++;
      } else if (duedate !== markerOfcurrentElement["options"]["duedate"]) {
        console.log("duedate changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);

        // changer la popup
        listeMarqueurs[indexOfMarker].setPopupContent(
          renderPopUpContent(
            name,
            duedate,
            capacity,
            numdocksavailable,
            numbikesavailable,
            ebike,
            mechanical
          )
        );
        // IMPORTANT : MAJ des 'options' de l'ancien marqueur
        //listeMarqueurs[indexOfMarker].options.name = name;
        listeMarqueurs[indexOfMarker].options.duedate = duedate;
        //listeMarqueurs[indexOfMarker].options.capacity = capacity;
        listeMarqueurs[indexOfMarker].options.numbikesavailable =
          numbikesavailable;
        listeMarqueurs[indexOfMarker].options.numdocksavailable =
          numdocksavailable;
        listeMarqueurs[indexOfMarker].options.ebike = ebike;
        listeMarqueurs[indexOfMarker].options.mechanical = mechanical;
        insertVelibLogs("php/insertVelibLogs.php", element);
        updatedCount++;
      } else if (ebike !== markerOfcurrentElement["options"]["ebike"]) {
        console.log("ebike changed !" + " - " + name);

        console.log("avant : ", avant, "après : ", element);

        // changer la popup
        listeMarqueurs[indexOfMarker].setPopupContent(
          renderPopUpContent(
            name,
            duedate,
            capacity,
            numdocksavailable,
            numbikesavailable,
            ebike,
            mechanical
          )
        );

        // IMPORTANT : MAJ des 'options' de l'ancien marqueur
        //listeMarqueurs[indexOfMarker].options.name = name;
        listeMarqueurs[indexOfMarker].options.duedate = duedate;
        //listeMarqueurs[indexOfMarker].options.capacity = capacity;
        listeMarqueurs[indexOfMarker].options.numbikesavailable =
          numbikesavailable;
        listeMarqueurs[indexOfMarker].options.numdocksavailable =
          numdocksavailable;
        listeMarqueurs[indexOfMarker].options.ebike = ebike;
        listeMarqueurs[indexOfMarker].options.mechanical = mechanical;

        insertVelibLogs("php/insertVelibLogs.php", element);
        updatedCount++;
      } else if (
        mechanical !== markerOfcurrentElement["options"]["mechanical"]
      ) {
        console.log("mechanical changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);

        // changer la popup
        listeMarqueurs[indexOfMarker].setPopupContent(
          renderPopUpContent(
            name,
            duedate,
            capacity,
            numdocksavailable,
            numbikesavailable,
            ebike,
            mechanical
          )
        );
        // IMPORTANT : MAJ des 'options' de l'ancien marqueur
        //listeMarqueurs[indexOfMarker].options.name = name;
        listeMarqueurs[indexOfMarker].options.duedate = duedate;
        //listeMarqueurs[indexOfMarker].options.capacity = capacity;
        listeMarqueurs[indexOfMarker].options.numbikesavailable =
          numbikesavailable;
        listeMarqueurs[indexOfMarker].options.numdocksavailable =
          numdocksavailable;
        listeMarqueurs[indexOfMarker].options.ebike = ebike;
        listeMarqueurs[indexOfMarker].options.mechanical = mechanical;
        insertVelibLogs("php/insertVelibLogs.php", element);
        updatedCount++;
      } else if (name !== markerOfcurrentElement["options"]["name"]) {
        console.log("name changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);

        // changer la popup
        listeMarqueurs[indexOfMarker].setPopupContent(
          renderPopUpContent(
            name,
            duedate,
            capacity,
            numdocksavailable,
            numbikesavailable,
            ebike,
            mechanical
          )
        );
        // IMPORTANT : MAJ des 'options' de l'ancien marqueur
        //listeMarqueurs[indexOfMarker].options.name = name;
        listeMarqueurs[indexOfMarker].options.duedate = duedate;
        //listeMarqueurs[indexOfMarker].options.capacity = capacity;
        listeMarqueurs[indexOfMarker].options.numbikesavailable =
          numbikesavailable;
        listeMarqueurs[indexOfMarker].options.numdocksavailable =
          numdocksavailable;
        listeMarqueurs[indexOfMarker].options.ebike = ebike;
        listeMarqueurs[indexOfMarker].options.mechanical = mechanical;
        insertVelibLogs("php/insertVelibLogs.php", element);
        updatedCount++;
      } else if (
        numbikesavailable !==
        markerOfcurrentElement["options"]["numbikesavailable"]
      ) {
        console.log("numbikesavailable changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);

        // changer la popup
        listeMarqueurs[indexOfMarker].setPopupContent(
          renderPopUpContent(
            name,
            duedate,
            capacity,
            numdocksavailable,
            numbikesavailable,
            ebike,
            mechanical
          )
        );
        // IMPORTANT : MAJ des 'options' de l'ancien marqueur
        //listeMarqueurs[indexOfMarker].options.name = name;
        listeMarqueurs[indexOfMarker].options.duedate = duedate;
        //listeMarqueurs[indexOfMarker].options.capacity = capacity;
        listeMarqueurs[indexOfMarker].options.numbikesavailable =
          numbikesavailable;
        listeMarqueurs[indexOfMarker].options.numdocksavailable =
          numdocksavailable;
        listeMarqueurs[indexOfMarker].options.ebike = ebike;
        listeMarqueurs[indexOfMarker].options.mechanical = mechanical;
        insertVelibLogs("php/insertVelibLogs.php", element);
        updatedCount++;
      } else if (
        numdocksavailable !==
        markerOfcurrentElement["options"]["numdocksavailable"]
      ) {
        console.log("numdocksavailable changed !" + " - " + name);
        console.log("avant : ", avant, "après : ", element);

        // changer la popup
        listeMarqueurs[indexOfMarker].setPopupContent(
          renderPopUpContent(
            name,
            duedate,
            capacity,
            numdocksavailable,
            numbikesavailable,
            ebike,
            mechanical
          )
        );
        // IMPORTANT : MAJ des 'options' de l'ancien marqueur
        //listeMarqueurs[indexOfMarker].options.name = name;
        listeMarqueurs[indexOfMarker].options.duedate = duedate;
        //listeMarqueurs[indexOfMarker].options.capacity = capacity;
        listeMarqueurs[indexOfMarker].options.numbikesavailable =
          numbikesavailable;
        listeMarqueurs[indexOfMarker].options.numdocksavailable =
          numdocksavailable;
        listeMarqueurs[indexOfMarker].options.ebike = ebike;
        listeMarqueurs[indexOfMarker].options.mechanical = mechanical;
        insertVelibLogs("php/insertVelibLogs.php", element);
        updatedCount++;
      } else {
        /*
            
            if (duedate !==  markerOfcurrentElement['options']['duedate']) {    
                console.log("duedate changed !"+" - " + name);       
                console.log("avant : ", markerOfcurrentElement['options'], "après : ", element);
    
                // changer la popup
                listeMarqueurs[indexOfMarker].setPopupContent(renderPopUpContent(name,duedate,capacity,numdocksavailable,numbikesavailable,ebike,mechanical));
                // IMPORTANT : MAJ des 'options' de l'ancien marqueur
                //listeMarqueurs[indexOfMarker].options.name = name;
                listeMarqueurs[indexOfMarker].options.duedate = duedate;
                //listeMarqueurs[indexOfMarker].options.capacity = capacity;
                listeMarqueurs[indexOfMarker].options.numbikesavailable = numbikesavailable;
                listeMarqueurs[indexOfMarker].options.numdocksavailable = numdocksavailable;
                listeMarqueurs[indexOfMarker].options.ebike = ebike;
                listeMarqueurs[indexOfMarker].options.mechanical = mechanical;
                
                insertVelibLogs("php/insertVelibLogs.php",element); 

                updatedCount++;
            } */
        console.log("Station à jour, pas de changement.");
      }

      /**
       *
       *
       * TEEEEEEEEEEEST
       */
      /*
            if(stationcode== 45003) {
                console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                listeMarqueurs[indexOfMarker].openPopup();
            }
            */
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


 // Open the sidebar by default with some content
 //sidebar.setContent('<h2>My Sidebar Content</h2><p>Hello, this is a sidebar!</p>');
 //sidebar.show();

      console.log("FIN initStationsOnTheMap");
      let listeMarqueurs = markers.getLayers();

      console.log(listeMarqueurs);

      


      //console.log('AAAAAAAAAAAAAAAAAAAAAA',indexOfUserLocationMarker)

      //let userPositionMarker = map._layers[indexOfUserLocationMarker];

      // test du routing...

       //let routingMethod = "Bike";

       let routing = initRouting("bike","fr");


       routing.addTo(map);

// container de l'interface de routing 
let leafletRoutingContainer = document.querySelector('.leaflet-routing-container');

//console.log('jjjjjjjjjjjj', leafletRoutingContainers.length);
if (leafletRoutingContainer) {
    // Créez un nouvel élément <h1>
    let nouvelElementH1 = document.createElement('h1');

    // Ajoutez du texte à l'élément h1 si nécessaire
    nouvelElementH1.textContent = 'Où allons-nous ?';

    // Appliquez des styles CSS à l'élément h1
    nouvelElementH1.style.marginLeft = '10px'; // Ajoute une marge en bas
    nouvelElementH1.style.marginTop = '10px'; // Ajoute une marge en bas
    nouvelElementH1.style.fontSize = '16px'; // Réduit la taille de la police
    nouvelElementH1.style.textDecorationLine = 'underline';

    // Récupérez le premier enfant de l'élément container
    let premierEnfant = leafletRoutingContainer.firstChild;

    // Insérez l'élément h1 avant le premier enfant
    leafletRoutingContainer.insertBefore(nouvelElementH1, premierEnfant);
} 
 else {
        console.log('Aucun élément avec la classe ".leaflet-routing-container" trouvé.');
    }




      // listener 
      /**
       *  TODO : Si un itinéraire valide est choisit :
       *  - verifier check de "Déposer mon vélo"
       *    - true : trouver la station avec un dock vide le plus proche de la destination
       * 
       * 
       *  */



      routing.on('routeselected', function (e) {

      
        console.log('Route selected:', e.route);

        // "Déposer mon vélo"
        if (isCheckboxChecked('settings-drop-off-velib')) {

          // Les waypoints qui compose le traet : label + position (lat,lon)
          let actualWaypoints = e.route.actualWaypoints;
          console.log('WWWWWWWWWWWWWWWWWw:', actualWaypoints);
          // On recupere la destination finale
          let finalDestination = actualWaypoints[actualWaypoints.length-1];


          console.log('PPPPPPPPPPPPPPPP',markers.getLayers())
          console.log('OOOOOOOOOOOOOOOOOOOOO',finalDestination)

          // Requête au serveur pour recuperer l'id du marqueur de la station la plus proche de la destination
          let findNearestStationQuery = findNearestStation("php/findNearestStation.php",markers.getLayers(),finalDestination.latLng)
  
          .then((response)=>{                  

            console.log("findNearestStationQuery",response);

                        // recuperer seulement les coordonnées des waypoints pour MAJ le routing 
                        var marqueurSpecifique = markers.getLayer(response['nearestSationID']);

                        let actualWaypointsPosOnly = actualWaypoints.map(waypoint => waypoint.latLng);
                        console.log("TEST1",Object.assign({}, actualWaypointsPosOnly));   
            
            // Vérifiez si le marqueur a été trouvé.
            if (marqueurSpecifique) {                       
            
            
            actualWaypointsPosOnly.splice(actualWaypointsPosOnly.length - 1, 0, marqueurSpecifique.getLatLng());

            console.log("TEST2",actualWaypointsPosOnly);     
            
            updateRouting(routing,'bike','fr',actualWaypointsPosOnly);   
                // ouvrir popup
                marqueurSpecifique.openPopup();

                
            } else {
              alert('Station non trouvé');
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
      routing.on('geocoderequest', function (e) {
        console.log('Geocode request:', e);
      });

      routing.on('routingupdateend', function () {
        console.log('Routing update completed');
        // Ajoutez ici tout code supplémentaire à exécuter après la mise à jour du routage
    });




      if(getUserLocation) {
        //createRouting(map,[listeMarqueurs[0].getLatLng(), L.latLng(57.6792, 11.949)]); 
        //createRouting(map,[markers.getLayer(leafletIdOfUserLocationMarker).getLatLng(), L.latLng(57.6792, 11.949)],"bike","fr"); 
        
        //createRouting(map,[userPositionMarker.getLatLng(), L.latLng(57.6792, 11.949)],"bike","fr"); 
        updateRouting(routing,"bike","fr",[userPositionMarker.getLatLng(), L.latLng(57.6792, 14.949),L.latLng(57.6792, 11.949)]);
        //updateRouting(routing,"bike","fr",[userPositionMarker.getLatLng(), L.latLng(48.875430, 2.392290)]);
      }
      //createRouting(map,[L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)]);

      /**
       * TEST
       */
      /*

        
        console.log('TEST...');

        refreshMap();


        let listeMarqueurs = markers.getLayers();

        console.log(listeMarqueurs)
        */
      
        listeMarqueurs.forEach(function(marker) {

            // TODO : comparer les données
            //console.log('BBBBBBBBBBBBBBBBBBBBB');
            //console.log(marker.options);
            //console.log(marker.getLatLng()); // Obtenez la position du marqueur
            // Ouvrez le popup de chaque marqueur regroupé
            //marker.openPopup();
            //var nouvellePosition = L.latLng(50, 5);
            //marker.setLatLng(nouvellePosition);
            //marker.setPopupContent('TEEEEEEEEEEEEST');
            //console.log('CCCCCCCCCCCCCCCCCCCCC',marker._leaflet_id);            
    });   

    //console.log('DDDDDDDDDDDDDDDDDDDDD',markers.getLayer(86));
    
    });

    initMain = true;
  } else {
    console.log("Refresh map...");


    if(getUserLocation) {

      //console.log('userPositionMarker',userPositionMarker.getLatLng())

      //console.log(markers.getLayers());
      //findNearestStation("php/findNearestStation.php",markers.getLayers(),userPositionMarker.getLatLng());
      
    } else {
      console.log(markers.getLayers());
    }

    
    
    
        refreshMap()
        .then((o)=> {

            //alert(o.updatedCount + " station(s) mis à jour.");
            var alertElement = document.getElementById('alert');

            if(o.updatedCount >0) {

                // afficher l'alert
                alertElement.classList.add('alert-success');
                alertElement.classList.remove('alert-info');
                alertElement.classList.remove('d-none');
                
            
                // changer le text
                //alertElement.innerText = o.updatedCount + " station(s) mis à jour"; // Change the inner text
                alertElement.innerHTML = '<span style="font-size: larger; font-weight: bold;">' + o.updatedCount + ' station(s) mis à jour</span>';
                
            } else{
    
                // afficher l'alert
                alertElement.classList.remove('alert-success');
                alertElement.classList.add('alert-info');
                alertElement.classList.remove('d-none');
                            
                // changer le text
                //alertElement.innerText = "Carte à jour."; // Change the inner text
                alertElement.innerHTML = '<span style="font-size: larger; font-weight: bold;">' + "Carte à jour"+'</span>';
                //alert("Carte à jour.")
            }

            // retirer
            setTimeout(function() {
                alertElement.classList.add('d-none');
            }, 4000);
            
        });
        
  }
}

const intervalInMilliseconds = 60 * 100;

main();

setInterval(main, intervalInMilliseconds);

// Listeners
markers.on("clusterclick", function (a) {
  console.log("Cluster Clicked", a);
});
markers.on("click", function (a) {
  console.log("Marker Clicked", a);
});



// TODO : au clique recuperer l'id du marqueuer le plus proche de l'utilisateur 
// --> se deplacer sur la station + ouvrir popup

document.addEventListener("DOMContentLoaded", function() {

const nearestStationBtn = document.getElementById("nearest-station-btn");

nearestStationBtn.addEventListener("click", function() {

  
  console.log("Button clicked!");
  //console.error("aa");

  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa",markers)
  console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb",userPositionMarker.getLatLng())

  let a = findNearestStation("php/findNearestStation.php",markers.getLayers(),userPositionMarker.getLatLng())
  
  .then((response)=>{

    console.log('AAAAAAAAAAAAAAAA',response);

    // Utilisez la méthode getLayer pour obtenir la couche du marqueur.
    var marqueurSpecifique = markers.getLayer(response['nearestSationID']);
    
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
let checkbox = document.getElementById('settings-drop-off-velib');

// Vérifier si la checkbox a été trouvée
if (checkbox) {
    // Ajouter l'écouteur d'événements uniquement si la checkbox est trouvée
    checkbox.addEventListener('change', function () {
        console.log('changggggggggge');
    });
} else {
    console.error("La checkbox avec l'ID 'settings-drop-off-velib' n'a pas été trouvée.");
}





}); // DOM 
