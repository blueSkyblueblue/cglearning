<script setup>
import { defineAsyncComponent, ref } from "vue";

const BottomLink = defineAsyncComponent(() => import("./BottomLink.vue"));

const emit = defineEmits(["setting-change"]);
const setting = ref({ fixedUp: false, showOrbit: false });

function toggleOrbit() {
  setting.value.showOrbit = !setting.value.showOrbit;
  emit("setting-change", setting.value);
}

function toggleCamera() {
  setting.value.fixedUp = !setting.value.fixedUp;
  emit("setting-change", setting.value);
}
</script>

<template>
  <nav class="control-panel">
    <button @click="toggleOrbit">
      {{ setting.showOrbit ? "Disable Orbit" : "Enable Orbit" }}
    </button>
    <button @click="toggleCamera">
      {{ setting.fixedUp ? "Standard Camera" : "Basic Camera" }}
    </button>
    <BottomLink to="/spaceplayground">Click Here to Play around</BottomLink>
  </nav>
</template>

<style scoped>
.control-panel button {
  display: block;
  border: 0.5px white solid;
  border-radius: 2.5px;
  color: rgb(204, 90, 3);
  background: linear-gradient(to right bottom, rgb(56, 255, 215), rgb(40, 167, 251));
  font-size: 18px;
  width: 90%;
  margin: auto;
  margin-bottom: 1.5rem;
  height: 3rem;
  cursor: pointer;
}

.control-panel button:hover {
  background: linear-gradient(to right bottom, rgb(157, 248, 229), rgb(80, 185, 255));
  color: white;
  font-size: 20px;
  transition-duration: 0.15s;
}

.control-panel {
  padding-top: 1.5em;
  min-height: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  scroll-behavior: smooth;
}
</style>
