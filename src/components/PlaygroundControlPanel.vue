<script setup>
import { defineAsyncComponent, onBeforeMount, ref } from "vue";

const BottomLink = defineAsyncComponent(() => import("./BottomLink.vue"));
const PlanetInfoForm = defineAsyncComponent(() => import("./PlanetInfoForm.vue"));
const props = defineProps({ planets: Array, config: Object });
defineEmits(["show-orbit", "change-camera", "update-planets"]);

const planetGalleries = ref([]);
const formData = ref();

function parse(planet) {
  return {
    ...planet[0],
    base: planet[1],
  };
}

function emptyTemplate(name) {
  return {
    radius: 5,
    segments: [32, 16],
    distance: 18,
    rotateSpeed: 5,
    selfRotateSpeed: 0,
    texture: "textures/earth.jpg",
    // light: { color: 0xffffff, intensity: 15000 },
    name,
    base: "sun",
  };
}

onBeforeMount(() => {
  props.planets.forEach(element => planetGalleries.value.push(parse(element)));
  console.log(...planetGalleries.value);
});

function remove(name) {
  planetGalleries.value = planetGalleries.value.filter(item => item.info.name !== name);
  console.log(planetGalleries.value);
}

let count = 0;
function newplanet(name) {
  count++;
  planetGalleries.value.push(emptyTemplate("planet_" + count));
}
</script>

<template>
  <nav class="controls">
    <div class="options">
      <button @click="$emit('show-orbit')">
        {{ props.config.orbit ? "disable orbit" : "show orbit" }}
      </button>
      <button @click="$emit('change-camera')">
        {{ props.config.fixedCamera ? "camera I" : "camera II" }}
      </button>
    </div>
    <hr />
    <div class="main">
      <PlanetInfoForm
        v-for="item in planetGalleries"
        :info="item"
        @comfirm="
          e_data => {
            console.log(e_data);
            $emit('update-planets', e_data);
          }
        "
        @remove="remove"
      />
      <button @click="newplanet" id="new-planet-btn">Add New One</button>
    </div>
    <div class="blank"></div>
    <BottomLink to="/solarsystem">Come back</BottomLink>
  </nav>
</template>

<style scoped>
hr {
  margin: 0.8em 0 0.5em;
  border: none;
  border-bottom: 1px solid rgb(51, 89, 156);
}

.controls {
  padding-top: 0.8em;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  scroll-behavior: smooth;
}

.options {
  display: flex;
  column-gap: 8%;
  justify-content: center;
}

.options > button {
  width: 34%;
  height: 2.2em;
  outline: none;
  border: none;
  border-radius: 2px;
  color: aliceblue;
  box-shadow: 0 0 0 0 white;
  background-color: rgb(36, 129, 67);
}

.options > button:hover {
  cursor: pointer;
  background-color: color-mix(in srgb, rgb(36, 129, 67) 80%, white);
}

.options > button:active {
  box-shadow: 0 0 2px 0 rgba(255, 255, 255);
  background-color: color-mix(in srgb, rgb(36, 129, 67) 72%, white);
}

#new-planet-btn {
  display: block;
  outline: 1px solid orange;
  border-color: white;
  border-width: 1px;
  color: rgb(67, 88, 107);
  margin-left: 6em;
  padding: 0.5em 1.5em;
}

.blank {
  height: 80%;
}
</style>
