const BASE_URL =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel";

const userPosIcon = new L.divIcon({
  className: "custom-marker",
  html: '<div style="background-color: red; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-user" style="color: white;"></i></div>',
  //iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  //shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [50, 50],
  iconAnchor: [20, 0],
  //popupAnchor: [1, -34],
  //shadowSize: [41, 41],
});

const bikeIcon = L.divIcon({
  className: "custom-marker",
  html: '<div style="background-color: blue; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-bicycle" style="color: white;"></i></div>',
  iconSize: [50, 50], // Taille
  iconAnchor: [20, 0], // Point d'ancrage de l'icône par rapport à la position du marqueur
});

const startIcon = L.divIcon({
  className: "custom-marker",
  html: '<div style="background-color: green; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-flag-checkered" style="color: white;"></i></div>',
  iconSize: [50, 50],
  iconAnchor: [20, 0],
});

const endIcon = L.divIcon({
  className: "custom-marker",
  html: '<div style="background-color: red; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-map-marker-alt" style="color: white;"></i></div>',
  iconSize: [50, 50],
  iconAnchor: [20, 0],
});

const intervalInMilliseconds = 60 * 100;

export {
  BASE_URL,
  userPosIcon,
  bikeIcon,
  startIcon,
  endIcon,
  intervalInMilliseconds,
};
