// https://restfulapi.net/http-status-codes/

// requête au serveur pour mettre en log les informations d'une station
function insertVelibLogs(url,station) {
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


// tests
/*
const fakeStation = {
    "capacity": 21,
    "code_insee_commune": null,
    "coordonnees_geo": {
      "lon": 2.3373600840568547,
      "lat": 48.87929591733507
    },
    "duedate": "2023-11-01T09:29:00+00:00",
    "ebike": 0,
    "is_installed": "OUI",
    "is_renting": "OUI",
    "is_returning": "OUI",
    "mechanical": 0,
    "name": "Toudouze - Clauzel",
    "nom_arrondissement_communes": "Paris",
    "numbikesavailable": 0,
    "numdocksavailable": 21,
    "stationcode": "9020"
  }
*/
//insertVelibLogs("../php/insertVelibLogs.php",fakeStation);


function checkIfFileExists(filePath) {
    fetch(filePath)
        .then(response => {
            if (response.status === 200) {
                console.log("Le fichier existe.");
            } else {
                console.log("Le fichier n'existe pas.");
            }
        })
        .catch(error => {
            console.error("Erreur de requête : " + error);
        });
}

//checkIfFileExists('../php/insertVelibLogs.php');

/**
 * MAJ  
 */