<script setup>
import { defineAsyncComponent, onBeforeMount, onMounted, ref } from "vue";

const BottomLink = defineAsyncComponent(() => import("./BottomLink.vue"));
const PlanetInfoForm = defineAsyncComponent(() => import("./PlanetInfoForm.vue"));
const props = defineProps({ planets: Array });
const planetGalleries = ref([]);

function parse(planet) {
  return {
    info: planet[0],
    base: planet[1],
    hasRing: planet[2],
    hasLight: planet[3],
  };
}

onBeforeMount(() => {
  props.planets.forEach(element => planetGalleries.value.push(parse(element)));
  console.log(...planetGalleries.value);
});
</script>

<template>
  <nav class="controls">
    <div class="options">
      <button>show orbit</button>
      <button>camera</button>
    </div>
    <hr />
    <div class="main">
      <PlanetInfoForm v-for="item in planetGalleries" v-bind="item"></PlanetInfoForm>
    </div>
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
  position: relative;
  padding-top: 0.8em;
  width: 100%;
  height: calc(100vh - 120px);
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
  background-color: rgb(36, 129, 67);
}

.options > button:hover {
  cursor: pointer;
  background-color: color-mix(in srgb, rgb(36, 129, 67) 80%, white);
}
</style>
