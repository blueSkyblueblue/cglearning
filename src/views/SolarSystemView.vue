<script setup>
import PageTemplate from "@/components/PageTemplate.vue";
import PageHeader from "@/components/PageHeader.vue";
import SolarSystem from "@/components/SolarSystem.vue";
import SolarSystemControlPanel from "@/components/SolarSystemControlPanel.vue";
import { ref } from "vue";

const setting = ref({ fixedUp: false, showOrbit: false });
const controlPanel = ref(null);
const additionalLinks = [{ path: "/three-view", text: "Three View" }];

// function toggleFullScreen() {
//   console.log(controlPanel.value);
//   controlPanel.value.classList.toggle("solarsystem-hidden");
//   toggleFullScreen.isFull.value = !toggleFullScreen.isFull.value;
// }
// toggleFullScreen.isFull = ref(false);

// window.addEventListener("keydown", e => {
//   if (e.key === "f" && e.ctrlKey === true) {
//     e.preventDefault();
//     toggleFullScreen();
//     console.log("Post Event (fullscreen)", toggleFullScreen.isFull.value);
//   }
// });

function onProcessSetting(e_setting) {
  console.log(e_setting);
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
      <SolarSystem :setting="setting" />
    </template>
  </PageTemplate>
</template>

<style scoped>
.background {
  background-image: linear-gradient(to bottom, rgb(209, 216, 168), rgb(77, 169, 109));
}
</style>
