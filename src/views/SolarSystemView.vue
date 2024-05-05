<script setup>
import SolarSystem from "@/components/SolarSystem.vue";
import { ref } from "vue";

const setting = ref({ fixedUp: false, showOrbit: false });
const controlPanel = ref(null);

function toggleFullScreen() {
  controlPanel.value.classList.toggle("solarsystem-hidden");
  toggleFullScreen.isFull.value = !toggleFullScreen.isFull.value;
}
toggleFullScreen.isFull = ref(false);

window.addEventListener("keydown", e => {
  if (e.key === "f" && e.ctrlKey === true) {
    e.preventDefault();
    toggleFullScreen();
    console.log("Post Event (fullscreen)", toggleFullScreen.isFull.value);
  }
});
</script>

<template>
  <div class="app-container">
    <nav class="control-panel" ref="controlPanel">
      <button @click="setting.showOrbit = !setting.showOrbit">
        {{ setting.showOrbit ? "Disable Orbit" : "Enable Orbit" }}
      </button>
      <button @click="setting.fixedUp = !setting.fixedUp">
        {{ setting.fixedUp ? "Standard Camera" : "Basic Camera" }}
      </button>
    </nav>
    <SolarSystem :setting="setting" :fullscreen="toggleFullScreen.isFull" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: row;
}

.control-panel {
  flex: auto;
  border: 1px solid black;
}

.control-panel button {
  display: block;
  border: 1px white solid;
  border-radius: 2.5px;
  color: rgb(204, 90, 3);
  background: linear-gradient(to right bottom, rgb(56, 255, 215), rgb(40, 167, 251));
  font-size: 18px;
  width: 90%;
  margin: auto;
  margin-top: 1.5rem;
  height: 3rem;
  cursor: pointer;
}

.control-panel button:hover {
  background: linear-gradient(to right bottom, rgb(157, 248, 229), rgb(80, 185, 255));
  color: white;
  font-size: 20px;
  transition-duration: 0.15s;
}
</style>

<style>
.solarsystem-hidden {
  display: none;
}
</style>
