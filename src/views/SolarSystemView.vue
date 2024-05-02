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
</style>

<style>
.solarsystem-hidden {
  display: none;
}
</style>
