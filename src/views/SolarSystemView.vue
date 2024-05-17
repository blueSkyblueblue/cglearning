<script setup>
import PageTemplate from "@/components/PageTemplate.vue";
import PageHeader from "@/components/PageHeader.vue";
import SolarSystem from "@/components/SolarSystem.vue";
import SolarSystemControlPanel from "@/components/SolarSystemControlPanel.vue";
import planetsInformation from "@/components/js/PlanetsInformation.js";
import { ref } from "vue";

const setting = ref({ fixedUp: false, showOrbit: false });
const additionalLinks = [{ path: "/three-view", text: "Three View" }];

function onProcessSetting(e_setting) {
  for (let key in setting.value) {
    setting.value[key] = e_setting[key];
  }
}
</script>

<template>
  <PageTemplate class="background" :links="additionalLinks">
    <template v-slot:header>
      <PageHeader>Solar System Travel</PageHeader>
    </template>
    <template class="controls" v-slot:controls>
      <SolarSystemControlPanel @setting-change="onProcessSetting" />
    </template>
    <template v-slot:content>
      <SolarSystem :setting="setting" :planets="planetsInformation" />
    </template>
  </PageTemplate>
</template>

<style scoped>
.background {
  background-image: linear-gradient(to bottom, rgb(209, 216, 168), rgb(77, 169, 109));
}
</style>
