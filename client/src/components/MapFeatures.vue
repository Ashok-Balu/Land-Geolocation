<template>
  <div class="absolute z-max transparent q-pa-md">
    <div class="relative-position">
      <div class="q-pa-md">
        <div class="q-gutter-md" style="width: 350px; max-width: 500px">
          <!-- Search Input -->
          <q-input
            placeholder="Start your search..."
            standout
            type="text"
            bg-color="white"
            bottom-slots
            filled
            v-model="searchQuery"
            clearable
            @focus="$emit('toggleSearchResults')"
          >
            <!-- Search Icon -->
            <template v-slot:append>
              <q-icon name="search" @click="getPlacesFromApi" />
            </template>
            <!-- Geolocation -->
            <template v-slot:after>
              <q-icon
                class="text-red"
                size="2em"
                name="assistant_navigation"
                @click="$emit('getGeolocation')"
              />
            </template>
          </q-input>
          <!-- Search Queries -->
          <div v-if="searchQuery && showResult">
            <!-- Loading Spinner -->
              <q-spinner
                v-if="!searchData && addressTriggered"
                color="red"
                size="4em"
              />
            <!-- Display Results -->
            <div v-else>
              <q-virtual-scroll
                style="max-height: 300px"
                :items="searchData"
                separator
                v-slot="{ item }"
              >
                <q-item
                  v-for="(result, index) in searchData"
                  :key="index"
                  @click="selectResult(result)"
                  filled
                  dense
                  clickable
                  class="bg-white text-black"
                >
                  <q-item-section avatar>
                    <q-icon color="primary" name="location_on" />
                  </q-item-section>
                  <q-item-section>{{ item.place_name_en }}</q-item-section>
                </q-item>
              </q-virtual-scroll>
            </div>
          </div>
        </div>
        <!-- Selected Search Result -->
        <div v-if="selectedResult" class="q-gutter-md" style="width: 350px">
          <q-card>
            <q-card-section>
              <q-icon
                name="cancel"
                class="q-pa-md text-red absolute-right"
                size="30px"
                @click="removeResult"
              />
            </q-card-section>
            <q-card-section class="q-pt-lg">
              <p>{{ selectedResult.place_name_en }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import placesService from "../services/places-services";

const $q = useQuasar();

const searchQuery = ref(null);
const searchData = ref(null);
const queryTimeout = ref(null);
const selectedResult = ref(null);
const addressTriggered = ref(false);

const props = defineProps({
  locationCoordinates: { type: Object },
  showResult: { type: Boolean },
});

const showResult = computed(() => {
  return props?.showResult;
});

const locationCoordinates = computed(() => {
  return props?.locationCoordinates;
});

const emit = defineEmits([
  "getGeolocation",
  "plotResult",
  "removeResult",
  "toggleSearchResults",
]);

const getPlacesFromApi = async () => {
  clearTimeout(queryTimeout.value);

  // reset data on a new search
  searchData.value = null;
  addressTriggered.value = true;
  queryTimeout.value = setTimeout(async () => {
    // Only make search, if there is value in query input
    if (searchQuery.value !== "") {
      const params = new URLSearchParams({
        fuzzyMatch: true,
        language: "en",
        limit: 10,
        proximity: props.locationCoordinates
          ? `${props.locationCoordinates.lng},${props.locationCoordinates.lat}`
          : "0,0",
      });
      //calling API
      const getPlacesResponse = await placesService.getPlaces(
        searchQuery.value,
        params
      );
      getPlacesResponse.error
        ? handlegetPlacesFailure(getPlacesResponse.error)
        : handlegetPlacesSuccess(getPlacesResponse.data);
    }
  }, 750);
};

const handlegetPlacesFailure = (error) => {
  //Response failure
  console.log("Error:", error);
};

const handlegetPlacesSuccess = (getPlacesResponse) => {
  //Response success
  searchData.value = getPlacesResponse.data.features;
};

const selectResult = (result) => {
  selectedResult.value = result;
  emit("plotResult", result.geometry);
};

const removeResult = () => {
  selectedResult.value = null;
  emit("removeResult");
};
</script>




