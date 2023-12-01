import { GRAPH_HOPPER_API_KEY } from "../config.js";

// DOCUMENTATION :  https://www.liedman.net/leaflet-routing-machine/api/#l-routing-plan
// https://www.liedman.net/leaflet-control-geocoder/docs/interfaces/nominatimoptions.html#geocodingqueryparams
export function initRouting(vehicle, locale, startIcon, endIcon) {
  try {
    let routing = L.Routing.control({
      //waypoints: waypoints, // default []
      lineOptions: {
        styles: [{ color: "#7f00ff", opacity: 1, weight: 7 }],
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
      geocoder: L.Control.Geocoder.nominatim({}),
      collapsible: true, // hide/show panel routing
      reverseWaypoints: false,
      showAlternatives: false,
      //routeWhileDragging,
      router: L.Routing.graphHopper(GRAPH_HOPPER_API_KEY, {
        urlParameters: {
          instructions: true, // liste des instructions (tourner à doite ...)
          vehicle: vehicle,
          locale: locale,
        },
      }),

      formatter: null,
    });

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
  } catch (e) {
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

  // Trigger route calculation
  routing.route();
}
