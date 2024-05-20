<script setup>
import { ref, defineAsyncComponent, watch } from "vue";
import PageTemplate from "@/components/PageTemplate.vue";
import PageHeader from "@/components/PageHeader.vue";
import PlaygroundControlPanel from "@/components/PlaygroundControlPanel.vue";

const PlanetsSpace = defineAsyncComponent(() => import("@/components/PlanetsSpace.vue"));
const additionalLinks = [{ path: "/three-view", text: "Three View" }];

const size = ref({ width: 100, height: 100 });
const config = ref({ orbit: false, fixedCamera: false });

let scene = null;
const initialPlanets = [
  {
    name: "sun",
    base: "scene",
    radius: 10,
    distance: 0,
    revolutionSpeed: 0,
    rotationSpeed: 0.4,
    texture: "textures/sun.jpg",
    light: { color: 0xffffff, intensity: 15000 },
    segments: [40, 20],
  },
];

recalcSize();
window.addEventListener("resize", recalcSize);

function getSceneHandle(sceneHandle) {
  scene = sceneHandle;
  console.log(scene.reset(initialPlanets));
}

function recalcSize() {
  let width = window.innerWidth - 370;
  if (window.innerWidth > 1180) width -= 150;
  let height = window.innerHeight - 120;
  if (width < 0) width = 0;
  if (height <= 0) height = 1;
  size.value.width = width;
  size.value.height = height;
}

function updatePlanets(e_data) {
  const planet = scene.planets.find(item => item.info.name === e_data.name);
  if (planet) scene.change(planet, e_data);
  else scene.add(e_data);
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
        @remove="name => scene.remove(name)"
        :planets="initialPlanets"
        :config="config"
      />
    </template>
    <template v-slot:content>
      <PlanetsSpace
        @access-scene="getSceneHandle"
        :size="size"
        :config="config"
        :planets="[]"
        accessable="true"
      />
    </template>
  </PageTemplate>
</template>

<style scoped>
.background {
  background-image: linear-gradient(to bottom, rgb(209, 216, 168), rgb(77, 169, 109));
}
</style>
