<template>
  <div class="absolute z-max transparent q-pa-md">
    <div class="relative-position">
      <div class="q-pa-md q-gutter-sm" style="width: 350px; height: 100px">
        <q-dialog v-model="geoLocationErrorFlag">
          <q-card>
            <q-card-section>
              <h4 class="text-red">Alert</h4>
              <p>Error: {{ geoLocationErrorMsg }}</p>
              <p>
                To take advantage of this applications features, please ensure
                location services are enabled
              </p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                label="Close"
                color="primary"
                @click="$emit('closegeoLocationError')"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  geoLocationErrorMsg: { type: String },
  geoLocationErrorFlag: { type: Boolean },
});

const geoLocationErrorMsg = computed(() => {
  return props?.geoLocationErrorMsg;
});

const geoLocationErrorFlag = computed(() => {
  return props?.geoLocationErrorFlag;
});
</script>
