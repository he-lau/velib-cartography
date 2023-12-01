export function initMap(elementId, lat, lon) {
  let map = L.map(elementId).setView([lat, lon], 18);

  // Charger les données depuis openstreetmap
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20, // niveau de zoom max pour l'user
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

export function renderPopUpContent(
  name,
  duedate,
  capacity,
  numdocksavailable,
  numbikesavailable,
  ebike,
  mechanical
) {
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

export function initSideBar(map) {
  // Create a sidebar instance
  var sidebar = L.control
    .sidebar({
      autopan: false, // whether to maintain the centered map point when opening the sidebar
      closeButton: true, // whether t add a close button to the panes
      container: "sidebar", // the DOM container or #ID of a predefined sidebar container that should be used
      position: "left", // left or right
    })
    .addTo(map);

  // Open the sidebar by default
  //sidebar.showPanel('<h2>My Sidebar Content</h2><p>Hello, this is a sidebar!</p>');

  return sidebar;
}
