export function isCheckboxChecked(elementId) {
  var checkbox = document.getElementById(elementId);
  return checkbox.checked;
}

export async function getUserCoordonnees() {
  // promesse pour resoudre geolocalisation
  return new Promise((resolve, reject) => {
    // si l'API est dispo sur le navigateur
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const location = { lat: latitude, lon: longitude };
          //console.log(location);

          // resout avec pos
          resolve(location);
        },
        function (error) {
          console.error(error);
          reject(error);
        }
      );
    } else {
      console.error("Geolocation non disponible.");
      reject("Geolocation non disponible");
    }
  });
}
