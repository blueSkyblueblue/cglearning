<script setup>
import { ref, watch } from "vue";
import PageTemplate from "@/components/PageTemplate.vue";
import PageHeader from "@/components/PageHeader.vue";
import PlaygroundControlPanel from "@/components/PlaygroundControlPanel.vue";
import PlanetsSpace from "@/components/PlanetsSpace.vue";

const additionalLinks = [{ path: "/three-view", text: "Three View" }];

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

const size = ref({ width: 100, height: 100 });
const config = ref({ orbit: false, fixedCamera: false });

let updated = ref(false);

function recalcSize() {
  let width = window.innerWidth - 370;
  if (window.innerWidth > 1180) width -= 150;
  let height = window.innerHeight - 120;
  if (width < 0) width = 0;
  if (height <= 0) height = 1;
  size.value.width = width;
  size.value.height = height;

  console.log(size.value);
}

recalcSize();
window.addEventListener("resize", recalcSize);

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
        @show-orbit="config.orbit = !config.orbit"
        @change-camera="config.fixedCamera = !config.fixedCamera"
        @update-planets="updatePlanets"
        :planets="planets"
        :config="config"
      />
    </template>
    <template v-slot:content>
      <PlanetsSpace :size="size" :config="config" />
    </template>
  </PageTemplate>
</template>

<style scoped>
.background {
  background-image: linear-gradient(to bottom, rgb(209, 216, 168), rgb(77, 169, 109));
}
</style>
