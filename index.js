let data = [];
function initMap() {
  let markers = [];
  const uluru = { lat: 27.7763, lng: -82.6371 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: uluru,
  });
  var crashButton = document.getElementById("showInjury");
  var speedingButton = document.getElementById("speedingData");

  document.getElementById("showInjury").onclick = function showInjury() {
    let marker;

    speedingButton.style.display = "none";
    fetch(
      "https://voyager.technology/pinellas/data/v1/geojson/crash_2019_4326?geom_column=geom&columns=totalfatalities%2C%20rearend%2C%20totalinjuries&filter=totalfatalities%20%3E%200%20%20AND%20totalinjuries%20%3E%200"
    )
      .then((response) => response.json())
      .then((crash) => {
        let cord = crash.features;
        for (let myObj in cord) {
          let coordinatesData = cord[myObj].geometry.coordinates;
          let fatalInfo = cord[myObj].properties.totalfatalities;
          let injuryInfo = cord[myObj].properties.totalinjuries;
          var activeInfoWindow;
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(
              coordinatesData[1],
              coordinatesData[0]
            ),
            map: map,
          });
          markers.push(marker);
          const contentString =
            '<div id="content">' +
            `<p>Total Fatalities ${fatalInfo}</p>` +
            `<p>Total injuries ${injuryInfo}</p>` +
            "</div>";

          google.maps.event.addListener(marker, "click", function () {
            if (activeInfoWindow != null) activeInfoWindow.close();
            const infowindow = new google.maps.InfoWindow({
              content: contentString,
              maxWidth: 500,
            });
            activeInfoWindow = infowindow;
            activeInfoWindow.open(map, marker);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  document.getElementById("speedingData").onclick = function speedingData() {
    crashButton.style.display = "none";
    fetch(
      "https://voyager.technology/pinellas/data/v1/geojson/crash_2019_4326?geom_column=geom&columns=speeding&filter=speeding%20%3E%200"
    )
      .then((response) => response.json())
      .then((crash) => {
        let cord = crash.features;
        for (let myObj in cord) {
          let coordinatesData = cord[myObj].geometry.coordinates;
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(
              coordinatesData[1],
              coordinatesData[0]
            ),
            map: map,
          });
          markers.push(marker);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  document.getElementById("clearMarkers").onclick = function clear() {
    while (markers.length) {
      markers.pop().setMap(null);
      crashButton.style.display = "inline-block";
      speedingButton.style.display = "inline-block";
    }
  };
}
