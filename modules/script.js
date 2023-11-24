import {GRAPH_HOPPER_API_KEY} from "../config.js";

// https://restfulapi.net/http-status-codes/

// requête au serveur pour mettre en log les informations d'une station
export function insertVelibLogs(url,station) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(station)
    })
    .then(function (response) {
        if (response.status === 201) {
            // Le code de réponse 201 indique que la création a réussi
            return response.json();
        } else {
            // Gérer les autres codes de réponse ici
            console.error("Erreur lors de la création de la ressource. Code de réponse : " + response.status);
            return response.text(); // Récupérer le texte de la réponse
        }
    })
    .then(function (data) {
        //console.log(data);
    })
    .catch(function (erreur) {
        console.error(erreur);
    });
}

export function initMap(elementId,lat,lon) {

    let map = L.map(elementId).setView([lat, lon], 18);
    
    // Charger les données depuis openstreetmap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20, // niveau de zoom max pour l'user
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    L.control.locate().addTo(map);
    

/*
        //ajouter des fonds de carte
        var baselayers = {
            OSM: L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png'),
            ESRI: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'),
            openTopo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
            Forest: L.tileLayer('https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'),
            velo: L.tileLayer('http://tile.thunderforest.com/cycle/${z}/${x}/${y}.png')
        };baselayers.OSM.addTo(map);
*/
    return map;
}

export function initSideBar(map) {
      // Create a sidebar instance
      var sidebar = L.control.sidebar({
        autopan: false,       // whether to maintain the centered map point when opening the sidebar
        closeButton: true,    // whether t add a close button to the panes
        container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'left',     // left or right
    }).addTo(map);

  // Open the sidebar by default
  //sidebar.showPanel('<h2>My Sidebar Content</h2><p>Hello, this is a sidebar!</p>');

  return sidebar;
}

export async function getUserCoordonnees() {

    // promesse pour resoudre geolocalisation
    return new Promise((resolve, reject) => {
        // si l'API est dispo sur le navigateur
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const location = { lat: latitude, lon: longitude };
                //console.log(location);

                // resout avec pos
                resolve(location);
            }, function(error) {
                console.error(error);
                reject(error);
            });
        } else {
            console.error("Geolocation non disponible.");
            reject("Geolocation non disponible");
        }
    });
} 

export function renderPopUpContent(name,duedate,capacity,numdocksavailable,numbikesavailable,ebike,mechanical) {
/*    
    let popupContent = `
                <strong>Station Information</strong><br>
                <ul>
                <li><i class="fas fa-map-marker-alt"></i> Name: ${name}</li>
                <li><i class="far fa-calendar-check"></i> Due Date: ${duedate}</li>
                <li><i class="fas fa-users"></i> Capacity: ${capacity}</li>
                <li><i class="fas fa-parking"></i> Docks Available: ${numdocksavailable}</li>
                <li><i class="fas fa-bicycle"></i> Bikes Available: ${numbikesavailable}</li>                        
                <li><i class="fas fa-bolt"></i> E-Bike Available: ${ebike}</li>
                <li><i class="fas fa-bicycle"></i> Mechanical Bikes: ${mechanical}</li>

                </ul>
              `;
*/
    let popupContent = `
                <strong>Station Information</strong><br>
                <ul>
                <li><i class="fas fa-map-marker-alt"></i> Name: ${name}</li>
                <li><i class="fas fa-users"></i> Capacity: ${capacity}</li>
                <li><i class="fas fa-parking"></i> Docks Available: ${numdocksavailable}</li>
                <li><i class="fas fa-bicycle"></i> Bikes Available: ${numbikesavailable}</li>                        
                <li><i class="fas fa-bolt"></i> E-Bike Available: ${ebike}</li>
                <li><i class="fas fa-bicycle"></i> Mechanical Bikes: ${mechanical}</li>

                </ul>
              `;              
    return popupContent;            


    
}




// DOCUMENTATION :  https://www.liedman.net/leaflet-routing-machine/api/#l-routing-plan
// https://www.liedman.net/leaflet-control-geocoder/docs/interfaces/nominatimoptions.html#geocodingqueryparams
export function initRouting(vehicle,locale, startIcon, endIcon) {



    try {
        
        let routing = L.Routing.control({
            //waypoints: waypoints, // default []
            lineOptions: {
                styles: [{color: '#7f00ff', opacity: 1, weight: 7}]
            },
            createMarker: function (i, waypoint, n) {
                if (i === 0) {
                    // Starting point
                    return L.marker(waypoint.latLng, { icon: startIcon });
                } else if (i === n - 1) {
                    // Ending point
                    return L.marker(waypoint.latLng, { icon: endIcon });
                } else {
                    // Waypoints in between (default blue marker)
                    return L.marker(waypoint.latLng);
                }
            },
            geocoder: L.Control.Geocoder.nominatim({    
            }),
            //collapsible: true, // hide/show panel routing
            reverseWaypoints: false,
            showAlternatives: false,
            //routeWhileDragging,            
            router: L.Routing.graphHopper(GRAPH_HOPPER_API_KEY, {
                urlParameters : {
                    instructions:true, // liste des instructions (tourner à doite ...)
                    vehicle:vehicle,
                    locale:locale
                }
            }),

            formatter: null

        })
        
        //.addTo(map);


        /*
        // https://stackoverflow.com/questions/38391132/graphopper-options-in-leaflet
        routing.getRouter().options.urlParameters.vehicle = 'bike'; 
        routing.getRouter().options.urlParameters.locale = 'fr'; 

        routing.route();
*/


        //console.log(routing);
        //console.log(routing.getRouter());


    return routing;

    } catch(e) {
        console.error(e);
    }

}


/***
 * Fonction pour mettre à jour le routing
 * 
 */

export function updateRouting(routing, vehicle, locale, waypoints) {

    // mettre à jour la langue
    routing.getRouter().options.urlParameters.locale = locale;

    // points de passages
    routing.setWaypoints(waypoints);
    
    routing.getRouter().options.urlParameters.vehicle = vehicle;



    // Trigger route calculation with updated waypoints
    routing.route();
}





/**
 *  TODO :
 * 
 */
export function findNearestStation(url, stationsMarkers, initialPos, dockAvailable=true) {

    const markerData = stationsMarkers.map(marker => {
        return {
            // position
            latlng: marker.getLatLng(), 
            // options (stationcode, ebike ...)
            options:marker['options'],
            // leaflet id
            leaflet_id:marker['_leaflet_id']
        };
    });

    const requestData = {
        stationsMarkers: markerData,
        initialPos: initialPos,
        // param pour savoir si la station doit contenir un dock avec au minima 1 place libre
        dockAvailable:dockAvailable
    };


    let promise = fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
    })
    .then(function (response) {

        if (response.status === 200) {

            return response.json();
        } else {

            console.error(response);        
        }
    })
    .then((data)=>{
        // TODO : 
        console.log(data);

        return data;
    })
    .catch((error) => {

        console.error('Error:', error);
        console.error('Error:', error.message); // Affiche le message d'erreur spécifique

    });

    return promise;
    
}


/**
 * TODO 2 : 
 * 
 * 
 */
export function findNearestStationWithAPI(stationsMarkers, initialPos) {




}


export function isCheckboxChecked(elementId) {
    var checkbox = document.getElementById(elementId);
    return checkbox.checked;
  }

































