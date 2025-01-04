let map;
let marker;
let autocomplete;

/**
 * Initialisiert Google Places Autocomplete mit dem Input-Feld.
 */
function initAutocomplete() {
  const input = document.getElementById("searchInput");

  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["formatted_address", "geometry"],
  });

  // Event listener for place changed
  autocomplete.addListener("place_changed", showPlaceDetails);
}

/**
 * Initialisiert die Karte und den Marker.
 */
function initMap() {
  const defaultPosition = { lat: 47.4979, lng: 8.7296 }; // Default position (e.g., Zurich, Switzerland)

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultPosition,
    zoom: 15,
  });

  marker = new google.maps.Marker({
    position: defaultPosition,
    map: map,
  });
}

/**
 * Liest die Daten aus dem ausgewählten Place aus
 * und zeigt sie im DOM und auf der Karte an.
 */
function showPlaceDetails() {
  const input = document.getElementById("searchInput").value;

  // Wenn das Eingabefeld leer ist, eine Fehlermeldung anzeigen
  if (!input) {
    alert("Bitte geben Sie einen Ort ein!");
    return;
  }

  const place = autocomplete.getPlace();

  // Wenn Place oder Geometry fehlt, war das kein gültiger Ort.
  if (!place || !place.geometry) {
    alert("Bitte einen gültigen Ort aus der Vorschlagsliste auswählen!");
    return;
  }

  // 1) Adresse im DOM anzeigen
  const address = place.formatted_address || "Keine Adresse gefunden";
  $("#addressOutput").fadeOut(function () {
    $(this).text(address).fadeIn();
  });

  // 2) Koordinaten im DOM anzeigen
  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();
  $("#coordsOutput").fadeOut(function () {
    $(this).text(`Lat: ${lat}, Lng: ${lng}`).fadeIn();
  });

  // 3) Karte aktualisieren
  updateMap(lat, lng);

  // 4) Daten im Local Storage speichern
  localStorage.setItem("address", address);
  localStorage.setItem("lat", lat);
  localStorage.setItem("lng", lng);

  // 5) Ergebnisbereich und Karte anzeigen
  $("#resultContainer").show();
  $("#map").show();
}

/**
 * Zentriert die Karte und setzt den Marker auf die neuen Koordinaten.
 */
function updateMap(lat, lng) {
  // Neue Position
  const position = { lat, lng };
  map.setCenter(position);
  marker.setPosition(position);
}

/**
 * Lädt den gespeicherten Zustand aus dem Local Storage und aktualisiert den DOM und die Karte.
 */
function loadSavedState() {
  const address = localStorage.getItem("address");
  const lat = localStorage.getItem("lat");
  const lng = localStorage.getItem("lng");

  if (address && lat && lng) {
    // Adresse im DOM anzeigen
    $("#addressOutput").text(address);

    // Koordinaten im DOM anzeigen
    $("#coordsOutput").text(`Lat: ${lat}, Lng: ${lng}`);

    // Karte aktualisieren
    updateMap(parseFloat(lat), parseFloat(lng));

    // Ergebnisbereich und Karte anzeigen
    $("#resultContainer").show();
    $("#map").show();
  }
}

/**
 * Überprüft, ob die Google Maps API geladen ist.
 */
function checkGoogleMapsAPI() {
  if (typeof google === "undefined" || typeof google.maps === "undefined") {
    alert(
      "Google Maps API konnte nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
    );
  }
}

// Beim Laden der Seite den gespeicherten Zustand laden
$(document).ready(function () {
  checkGoogleMapsAPI();
  initMap();
  initAutocomplete();
  loadSavedState();

  // Event listener for the button click
  $("#showDetailsBtn").click(function () {
    const input = document.getElementById("searchInput").value;

    // Wenn das Eingabefeld leer ist oder der Ort nicht vollständig ist, eine Fehlermeldung anzeigen
    if (!input) {
      alert("Bitte geben Sie einen vollständigen Ort ein!");
    } else {
      showPlaceDetails();
    }
  });
});
