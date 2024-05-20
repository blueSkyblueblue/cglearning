<script setup>
import { defineAsyncComponent } from "vue";

const BottomLink = defineAsyncComponent(() => import("./BottomLink.vue"));
defineProps(["setting"]);
defineEmits(["setting-change"]);
</script>

<template>
  <nav class="control-panel">
    <button @click="$emit('setting-change', 'orbit')">
      {{ setting.orbit ? "Disable Orbit" : "Enable Orbit" }}
    </button>
    <button @click="$emit('setting-change', 'fixedCamera')">
      {{ setting.fixedCamera ? "Fixed Camera" : "Rotated Camera" }}
    </button>
    <hr />
    <div class="message">
      press <span class="note">&lt;Shift + F&gt;</span> to make the view fullscree
    </div>
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

.message {
  font-size: 18px;
  margin-top: 1em;
  background-color: rgb(76, 35, 35);
  padding: 0.4em 1em;
  color: rgb(86, 198, 45);
}

.note {
  color: salmon;
  font-style: italic;
  background-color: rgb(106, 89, 68);
  border-radius: 2px;
  padding: 0 0.2em;
}
</style>
