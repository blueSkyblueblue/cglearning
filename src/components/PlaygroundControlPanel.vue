<script setup>
import { defineAsyncComponent, onBeforeMount, ref } from "vue";
import InputTemplate from "./js/InputTemplate";

const BottomLink = defineAsyncComponent(() => import("./BottomLink.vue"));
const PlanetInfoForm = defineAsyncComponent(() => import("./PlanetInfoForm.vue"));
const props = defineProps({ planets: Array, config: Object });
const emit = defineEmits(["show-orbit", "remove", "change-camera", "update-planets"]);

const planetGalleries = ref([]);
const asking = ref(false);
const newPlanetName = ref("");
const customContent = ref("");

onBeforeMount(() => {
  props.planets.forEach(element => planetGalleries.value.push(element));
  console.log(planetGalleries.value);
});

function remove(planet) {
  planetGalleries.value = planetGalleries.value.filter(item => item.name !== planet.name);
  emit("remove", planet);
  console.log("now", planetGalleries.value);
}

function addPlanetForm(name) {
  if (!name || planetGalleries.value.find(item => item.name == name)) {
    customContent.value = "The name already exists or it's not valid!";
    return;
  }

  customContent.value = "";
  asking.value = false;
  planetGalleries.value.push(new InputTemplate(name).generate());
}

function explanationOfCamera() {
  return "The camera currently used is ".concat(
    props.config.fixedCamera ? "FixedCamera" : "RotatedCamera"
  );
}

console.log(planetGalleries.value);
</script>

<template>
  <nav class="controls">
    <div class="options">
      <button @click="$emit('show-orbit')">
        {{ props.config.orbit ? "disable orbit" : "show orbit" }}
      </button>
      <button @click="$emit('change-camera')" :title="explanationOfCamera()">
        to {{ props.config.fixedCamera ? "camera I" : "camera II" }}
      </button>
    </div>
    <hr />
    <div class="main">
      <PlanetInfoForm
        v-for="item in planetGalleries"
        :info="item"
        @comfirm="e_data => $emit('update-planets', e_data)"
        @remove="remove"
      />
      <div class="pop-window" v-if="asking">
        <input
          type="text"
          placeholder="Enter the planet name"
          @change="newPlanetName = $event.target.value.trim()"
        />
      </div>
      <div class="custom" v-if="customContent">{{ customContent }}</div>
      <button @click="asking ? addPlanetForm(newPlanetName) : (asking = true)" id="new-planet-btn">
        {{ asking ? "Ok" : "Add New One" }}
      </button>
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

.pop-window > input {
  display: block;
  margin: auto;
  width: 80%;
  height: 2.5em;
  outline: none;
}

.custom {
  display: block;
  width: 100%;
  padding: 0.2em 0;
  text-align: center;
  color: rgb(128, 21, 137);
}

#new-planet-btn {
  display: block;
  outline: 1px solid orange;
  border-color: white;
  border-width: 1px;
  color: rgb(67, 88, 107);
  margin: auto;
  margin-top: 1em;
  padding: 0.5em 1.5em;
}

.blank {
  height: 80%;
}
</style>
