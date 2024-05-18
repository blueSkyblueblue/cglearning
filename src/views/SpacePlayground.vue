<script setup>
import { ref, watch } from "vue";
import PageTemplate from "@/components/PageTemplate.vue";
import PageHeader from "@/components/PageHeader.vue";
import SolarSystem from "@/components/SolarSystem.vue";
import PlaygroundControlPanel from "@/components/PlaygroundControlPanel.vue";

const additionalLinks = [{ path: "/three-view", text: "Three View" }];
const setting = ref({ fixedUp: false, showOrbit: false });

const planets = ref([
  [
    {
      radius: 10,
      segments: [40, 20],
      distance: 0,
      rotateSpeed: 0,
      selfRotateSpeed: 0.4,
      texture: "textures/sun.jpg",
      light: { color: 0xffffff, intensity: 15000 },
      name: "sun",
    },
    "scene",
    false,
    true,
  ],
]);

let updated = ref(false);

function toggleOrbit(arg) {
  setting.value.showOrbit = arg;
}

function toggleCamera(arg) {
  setting.value.fixedUp = arg;
}

function updatePlanets(e_data) {
  const index = planets.value.findIndex(item => item[0].name === e_data[0].name);
  if (index >= 0) planets.value[index] = e_data;
  else planets.value.push(e_data);

  updated.value = true;
  console.log("SpacePlaygound: ", planets.value);
}
</script>

<template>
  <PageTemplate class="background" :links="additionalLinks">
    <template v-slot:header>
      <PageHeader>Playground [have a good time] 💕</PageHeader>
    </template>
    <template class="controls" v-slot:controls>
      <PlaygroundControlPanel
        @show-orbit="toggleOrbit"
        @change-camera="toggleCamera"
        @update-planets="updatePlanets"
        :planets="planets"
      />
    </template>
    <template v-slot:content>
      <SolarSystem
        :setting="setting"
        :planets="planets"
        :updated="updated"
        @update-done="updated = false"
      />
    </template>
  </PageTemplate>
</template>

<style scoped>
.background {
  background-image: linear-gradient(to bottom, rgb(209, 216, 168), rgb(77, 169, 109));
}
</style>
