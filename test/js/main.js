import { initMap, getUserCoordonnees, renderPopUpContent, insertVelibLogs } from "../../modules/script.js";


const BASE_URL = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel";

const redIcon = new L.Icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

 
let map;

let mapInitialized = false;

let markers = L.markerClusterGroup();


// variable pour garder en mémoire l'indice des markers
let indexOfMarkers = [];

const initStationsOnTheMap = async () => {

    let userLocation = {};


    try {

        // Appel de la fonction getUserCoordonnees de manière asynchrone
        await getUserCoordonnees()
            .then(location => {

                //console.log('test', location.lon);

                if(! mapInitialized) {
                    // init leaflet map
                    //map = initMap('map',location.lat,location.lon);   
                    map = initMap('map',location.lat,location.lon);   
                    mapInitialized = true;
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
                let userPositionMarker = L.marker(
                    [location.lat, location.lon],
                    {
                    icon : redIcon
                    }
                );

                //userPositionMarker._icon.style.color = 'red';

                userPositionMarker.bindPopup("User location");
                markers.addLayer(userPositionMarker);


            }) // reject
            .catch(error => {
                console.error(error);
            });     
            
            
        if(! mapInitialized) {
            //console.log('mapInitialized',mapInitialized);
            // init leaflet map
            map = initMap('map',48.833314,.3520025);    
        }
        



        const response = await fetch(BASE_URL+"/exports/json");
        const text = await response.text();

        let data = await JSON.parse(text);
        console.log(data);
        
        
        data.forEach(element => {

            if(element !== null) {

                if(element["coordonnees_geo"] !== null) {



                    if(element["coordonnees_geo"]['lon'] !== null && element["coordonnees_geo"]['lat'] !== null ) {

// Logs
insertVelibLogs("php/insertVelibLogs.php",element); 


let stationcode = element["stationcode"];
let coordonnees_geo = element["coordonnees_geo"];
let lon = coordonnees_geo['lon'];
let lat = coordonnees_geo['lat'];
let capacity = element['capacity'];
let duedate = element['duedate'];
let ebike = element['ebike'];
let is_installed = element['is_installed'];
let is_renting = element['is_renting'];
let is_returning = element['is_returning'];
let mechanical = element['mechanical'];
let name = element['name'];
let nom_arrondissement_communes = element['nom_arrondissement_communes'];
let numbikesavailable = element['numbikesavailable'];
let numdocksavailable = element['numdocksavailable'];



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
let popupContent = renderPopUpContent(name,duedate,capacity,numdocksavailable,numbikesavailable,ebike,mechanical);

// TODO : sauvegarder les meta datas
let marker = L.marker(
[lat, lon], 
{
stationcode : stationcode,
name: name,
duedate: duedate,
capacity: capacity,
numdocksavailable: numdocksavailable,
numbikesavailable: numbikesavailable,
ebike: ebike,
mechanical: mechanical
}                        
);
marker.bindPopup(popupContent);

markers.addLayer(marker); // Ajoutez le marqueur au groupe de clusters.               




}
 



                }






            }






        });




        // IMPORTANT
        map.addLayer(markers); // Add the cluster group to the map.


    } catch(e) {
        console.error(e);
    }

};





 const refreshMap = async () => {
    
    const response = await fetch(BASE_URL+"/exports/json");
    const text = await response.text();

    let data = await JSON.parse(text);

    //console.log(data);
    
    //console.log("markers clusters",markers);

    let listeMarqueurs = markers.getLayers();

 

    //console.log("markers list",listeMarqueurs);

    //console.log("first marker : ",listeMarqueurs[0]);
    //console.log("first marker option : ",listeMarqueurs[0]['options']);

    let updatedCount = 0;

        
        data.forEach(element => {

            let coordonnees_geo = element["coordonnees_geo"];
            let lon = coordonnees_geo['lon'];
            let lat = coordonnees_geo['lat'];


            if(lon !== null && lat !== null) {

            // Logs
            //insertVelibLogs("php/insertVelibLogs.php",element); 


            let stationcode = element["stationcode"];

            let capacity = element['capacity'];
            let duedate = element['duedate'];
            let ebike = element['ebike'];
            let is_installed = element['is_installed'];
            let is_renting = element['is_renting'];
            let is_returning = element['is_returning'];
            let mechanical = element['mechanical'];
            let name = element['name'];
            let nom_arrondissement_communes = element['nom_arrondissement_communes'];
            let numbikesavailable = element['numbikesavailable'];
            let numdocksavailable = element['numdocksavailable'];

            //  le marqueur lié à l'element courant   
            const markerOfcurrentElement = listeMarqueurs.find((element) => element['options']['stationcode'] === stationcode);
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
                stationcode : stationcode,
                name: name,
                duedate: duedate,
                capacity: capacity,
                numdocksavailable: numdocksavailable,
                numbikesavailable: numbikesavailable,
                ebike: ebike,
                mechanical: mechanical
                };  




            let avant =  Object.assign({}, markerOfcurrentElement['options']);
            
            // comparer les metadatas (options) & ssi different : maj vue    
            if(capacity !==  markerOfcurrentElement['options']['capacity']) {
                
                console.log("capacity changed !"+" - " + name);
                console.log("avant : ", avant, "après : ", element);

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
            } else if (duedate !==  markerOfcurrentElement['options']['duedate']) {    
                console.log("duedate changed !"+" - " + name);       
                console.log("avant : ", avant, "après : ", element);
    
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
            } else if (ebike !==  markerOfcurrentElement['options']['ebike']) { 
                console.log("ebike changed !"+" - " + name);  

                console.log("avant : ", avant, "après : ", element);
              
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
            } else if (mechanical !==  markerOfcurrentElement['options']['mechanical']) { 
                console.log("mechanical changed !"+" - " + name);  
                console.log("avant : ", avant, "après : ", element);

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
            } else if (name !==  markerOfcurrentElement['options']['name']) {
                console.log("name changed !"+" - " + name);   
                console.log("avant : ", avant, "après : ", element);
              
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
            } else if (numbikesavailable !==  markerOfcurrentElement['options']['numbikesavailable']) {                
                console.log("numbikesavailable changed !"+" - " + name);  
                console.log("avant : ", avant, "après : ", element);

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
            } else if (numdocksavailable !==  markerOfcurrentElement['options']['numdocksavailable']) { 
                console.log("numdocksavailable changed !"+" - " + name);   
                console.log("avant : ", avant, "après : ", element);
            
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
            
            } 
            
            
            
            
            
            
            
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
            } */else {
                console.log('Station à jour, pas de changement.');
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

        return {updatedCount:updatedCount};
        
                       


}





// Main

let initMain = false;


function main() {
    //markers.clearLayers();

    if(! initMain) {
        initStationsOnTheMap()
        .then(() => {
            console.log('FIN initStationsOnTheMap');
            let listeMarqueurs = markers.getLayers();

            console.log(listeMarqueurs)
                    /**
         * TEST
         */
        /*
        console.log('TEST...');

        refreshMap();


        let listeMarqueurs = markers.getLayers();

        console.log(listeMarqueurs)
        */
        /*
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
    });   
    */
        });

        initMain = true;

    } else {
        console.log('Refresh map...');
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
markers.on('clusterclick', function (a) {
    console.log('Cluster Clicked',a); 
});
markers.on('click', function (a) {
    console.log('Marker Clicked',a); 
});          
