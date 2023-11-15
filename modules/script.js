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

    return map;
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
    return popupContent;            
}