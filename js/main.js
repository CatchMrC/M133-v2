// Globale Variablen
let autocomplete;
let marker;
let map;

$(document).ready(function () {
  // Initialisiere zuerst die Karte
  initMap();
  // Dann Autocomplete
  initAutocomplete();

  // Event-Handler für den Button
  $("#showDetailsBtn").click(function () {
    showPlaceDetails();
  });
});

/**
 * Erstellt eine leere Karte, zentriert auf einen Default-Standort,
 * z.B. Koordinaten von Zürich.
 */

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const defaultCenter = { lat: 47.5211446, lng: 7.671223399999999 };

  map = new Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 14,
  });
  // HIER: Marker anlegen
  marker = new google.maps.Marker({
    position: defaultCenter,
    map: map,
    title: "Startort",
  });
}

/**
 * Initialisiert Google Places Autocomplete mit dem Input-Feld.
 */
function initAutocomplete() {
  const input = document.getElementById("searchInput");

  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["formatted_address", "geometry"],
  });
}

/**
 * Liest die Daten aus dem ausgewählten Place aus
 * und zeigt sie im DOM und auf der Karte an.
 */
function showPlaceDetails() {
  const place = autocomplete.getPlace();

  // Wenn Place oder Geometry fehlt, war das kein gültiger Ort.
  if (!place || !place.geometry) {
    alert("Bitte einen gültigen Ort aus der Vorschlagsliste auswählen!");
    return;
  }

  // 1) Adresse im DOM anzeigen
  const address = place.formatted_address || "Keine Adresse gefunden";
  $("#addressOutput").text(address);

  // 2) Koordinaten im DOM anzeigen
  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();
  $("#coordsOutput").text(`Lat: ${lat}, Lng: ${lng}`);

  // 3) Karte aktualisieren
  updateMap(lat, lng);
}

/**
 * Zentriert die Karte und setzt den Marker auf die neuen Koordinaten.
 */
function updateMap(lat, lng) {
  // Neue Position
  const newPosition = { lat: lat, lng: lng };

  // Karte zentrieren
  map.setCenter(newPosition);
  map.setZoom(15); // optional etwas ranzoomen

  // Marker versetzen
  marker.setPosition(newPosition);
  marker.setTitle("Gewählter Ort");
}
