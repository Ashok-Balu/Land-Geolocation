<template>
  <div class="window-height relative-position">
    <GeoLocationErrorModal
      v-if="geoLocationErrorFlag"
      :geoLocationErrorMsg="geoLocationErrorMsg"
      :geoLocationErrorFlag="geoLocationErrorFlag"
      @closegeoLocationError="closegeoLocationError"
    />
    <MapFeatures
      :locationCoordinates="locationCoordinates"
      @toggleSearchResults="toggleSearchResults"
      @getGeolocation="getGeolocation"
      @plotResult="plotResult"
      @removeResult="removeResult"
      :showResult="showResult"
    />
    <div id="mapid" class="full-height"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import leaflet from "leaflet";
import GeoLocationErrorModal from "../components/GeoLocationErrorModal.vue";
import MapFeatures from "../components/MapFeatures.vue";
import markedLocation from "../assets/map-marker-blue.svg";
import userLocation from "../assets/map-marker-red.svg";

const map = ref(null);
const VUE_APP_API_KEY = ref(
  "pk.eyJ1IjoiYXNob2tiYWx1IiwiYSI6ImNscWo2Nm94YzEwa3gycW8wNW1mZGR3bGwifQ.y4iik5n9BSdw1m4L1jpOpA"
);

const locationCoordinates = ref(null);
const fetchCoordsFlag = ref(null);
const geoMarker = ref(null);
const geoLocationErrorFlag = ref(null);
const geoLocationErrorMsg = ref(null);
const showResult = ref(false);
const resultMarker = ref(null);

const getGeolocation = () => {
  //  function is called, if we dont have locationCoordinates
  if (!locationCoordinates.value) {
    // check to see if we have coods in session sotrage
    if (sessionStorage.getItem("locationCoordinates")) {
      locationCoordinates.value = JSON.parse(
        sessionStorage.getItem("locationCoordinates")
      );
      plotGeoLocation(locationCoordinates.value);
      return;
    }

    // else get locationCoordinates from geolocation API
    fetchCoordsFlag.value = true;
    navigator.geolocation.getCurrentPosition(setCoords, getLocError);
    return;
  }

  // otherwise, remove location
  locationCoordinates.value = null;
  sessionStorage.removeItem("locationCoordinates");
  map.value.removeLayer(geoMarker.value);
};

const setCoords = (pos) => {
  // stop fetching
  fetchCoordsFlag.value = null;

  // set locationCoordinates in session storage
  const setSessionCoords = {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
  };
  sessionStorage.setItem(
    "locationCoordinates",
    JSON.stringify(setSessionCoords)
  );

  // set ref locationCoordinates value
  locationCoordinates.value = setSessionCoords;

  plotGeoLocation(locationCoordinates.value);
};

const getLocError = (error) => {
  // stop fetching locationCoordinates
  fetchCoordsFlag.value = null;
  geoLocationErrorFlag.value = true;
  geoLocationErrorMsg.value = error.message;
};

const plotGeoLocation = (locationCoordinates) => {
  // create custom marker
  const customMarker = leaflet.icon({
    iconUrl: userLocation,
    iconSize: [35, 35],
  });

  // create new marker with locationCoordinates and custom marker
  geoMarker.value = leaflet
    .marker([locationCoordinates.lat, locationCoordinates.lng], {
      icon: customMarker,
    })
    .addTo(map.value);

  // set map view to current location
  map.value.setView([locationCoordinates.lat, locationCoordinates.lng], 10);
};


const plotResult = (locationCoordinates) => {
  // If there is already a marker, remove it. Only allow 1
  if (resultMarker.value) {
    map.value.removeLayer(resultMarker.value);
  }
  const customMarker = leaflet.icon({
    iconUrl: markedLocation,
    iconSize: [35, 35], // size of the icon
  });
  resultMarker.value = leaflet
    .marker(
      [locationCoordinates.coordinates[1], locationCoordinates.coordinates[0]],
      {
        icon: customMarker,
      }
    )
    .addTo(map.value);
  map.value.setView(
    [locationCoordinates.coordinates[1], locationCoordinates.coordinates[0]],
    13
  );
};

const removeResult = () => {
  map.value.removeLayer(resultMarker.value);
};

const closegeoLocationError = () => {
  geoLocationErrorMsg.value = null;
  geoLocationErrorFlag.value = null;
};

const toggleSearchResults = () => {
  showResult.value = !showResult.value;
};
const closeSearchResults = () => {
  showResult.value = null;
};

onMounted(() => {
  // initialize map
  map.value = leaflet
    .map("mapid", {
      zoomControl: false,
    })
    .setView([11.3812013, 77.899604], 10);

    // add tile layers
  leaflet
    .tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${VUE_APP_API_KEY.value}`,
      {
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: VUE_APP_API_KEY.value,
      }
    )
    .addTo(map.value);

  map.value.on("moveend", () => {
    closeSearchResults();
  });

  // get users location
  getGeolocation();
});
</script>

