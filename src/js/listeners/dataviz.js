import {
  getStationInformationsByStationCode,
  getAllStations,
} from "../../../modules/serverQuery.js";

// Listeners

// au clique recuperer l'id du marqueuer le plus proche de l'utilisateur
// --> se deplacer sur la station + ouvrir popup

document.addEventListener("DOMContentLoaded", function () {
  /**
   *
   * dataviz
   *
   */

  const selectDataViz = document.getElementById("selected-station-for-dataviz");
  const chartCanva = document.getElementById("myChart");
  const ctx = document.getElementById("myChart").getContext("2d");

  let chartInit = false;
  let currentChart;

  getAllStations("../src/php/getAllStations.php").then((response) => {
    console.log("getAllStations", response);

    // MAJ select

    //selectDataViz.innerHTML = "";
    //currentChart.destroy();

    response.stations.forEach((station) => {
      const option = document.createElement("option");
      option.value = station.stationcode; // name
      option.text = station.name;
      selectDataViz.add(option);
    });
  });

  selectDataViz.addEventListener("change", function () {
    // TODO : supprimer le canva s'il n'est pas vide
    //chartCanva.innerHTML = "";

    //currentChart = myChart;
    if (chartInit) {
      currentChart.destroy();
    }

    // Get the selected option
    const selectedOption = selectDataViz.options[selectDataViz.selectedIndex];

    // Log the selected station code and name
    console.log("Selected Station Code:", selectedOption.value);
    console.log("Selected Station Name:", selectedOption.text);

    // TODO requête serveur pour insérer le chart pour la station
    getStationInformationsByStationCode(
      "../src/php/getStationInformationsByStationCode.php",
      selectedOption.value
    ).then((response) => {
      console.log("getStationInformationsByStationCode", response);

      //const timestamps = response.stations.map((entry) => entry.log_timestamp);
      const timestamps = response.stations.map((entry) => {
        const date = new Date(entry.log_timestamp);
        return date.toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      });

      const numBikesAvailable = response.stations.map((entry) =>
        parseInt(entry.numbikesavailable)
      );

      const numDocksAvailable = response.stations.map((entry) =>
        parseInt(entry.numdocksavailable)
      );

      console.log(timestamps);
      console.log(numBikesAvailable);

      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: timestamps,
          datasets: [
            {
              label: "Nombre de vélos disponible",
              data: numBikesAvailable,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              fill: false,
            },
            {
              label: "Nombre de docks disponible",
              data: numDocksAvailable,
              borderColor: "rgba(192, 45, 192, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        // options !!!!!
        options: {
          plugins: {
            zoom: {
              pan: {
                enabled: true,
                mode: "x",
              },
              zoom: {
                // plugin pour zoom
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "x",
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        }, // options
      });
      chartInit = true;
      currentChart = myChart;
    }); // getStationInformationsByStationCode
  });
}); // DOM
