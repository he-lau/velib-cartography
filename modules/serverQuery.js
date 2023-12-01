// requête au serveur pour mettre en log les informations d'une station
export function insertVelibLogs(url, station) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(station),
  })
    .then(function (response) {
      if (response.status === 201) {
        // Le code de réponse 201 indique que la création a réussi
        return response.json();
      } else {
        // Gérer les autres codes de réponse ici
        console.error(
          "Erreur lors de la création de la ressource. Code de réponse : " +
            response.status
        );
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

export function findNearestStation(
  url,
  stationsMarkers,
  initialPos,
  dockAvailable = true
) {
  const markerData = stationsMarkers.map((marker) => {
    return {
      // position
      latlng: marker.getLatLng(),
      // options (stationcode, ebike ...)
      options: marker["options"],
      // leaflet id
      leaflet_id: marker["_leaflet_id"],
    };
  });

  const requestData = {
    stationsMarkers: markerData,
    initialPos: initialPos,
    // param pour savoir si la station doit contenir un dock avec au minima 1 place libre
    dockAvailable: dockAvailable,
  };

  let promise = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        console.error(response);
      }
    })
    .then((data) => {
      console.log(data);

      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      console.error("Error:", error.message); // Affiche le message d'erreur spécifique
    });

  return promise;
}

/**
 * Récupèrer l'ensemble des stations DISTINCT (requête serveur)
 */
export function getAllStations(url) {
  let promise = fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    //body: JSON.stringify(requestData),
  })
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        console.error(response);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return promise;
}

export function getStationInformationsByStationCode(url, stationcode) {
  const fullUrl = `${url}?stationcode=${encodeURIComponent(stationcode)}`;

  const requestData = {
    stationcode: stationcode,
  };
  let promise = fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    //body: JSON.stringify(requestData),
  })
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        console.error(response);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return promise;
}
