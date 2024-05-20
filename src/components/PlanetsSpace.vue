<script setup>
import { onUnmounted, ref, watch, onMounted } from "vue";
import * as THREE from "three";
import SimpleScene from "./js/SimpleScene.js";
import Space from "./js/SpaceCamera.js";

const props = defineProps(["size", "config", "planets"]);
const domElement = ref(null);
const viewFocused = ref(true);

const renderer = ref(null);
const scene = new SimpleScene().reset(props.planets);

const rotatedCamera = new Space.RotatedCamera(50, 1);
const fixedCamera = new Space.FixedCamera(50, 1);
let camera = rotatedCamera;

const controlsMap = { forward: "w", back: "s", left: "a", right: "d", up: "q", down: "e" };
const controller = new Space.SpaceCameraController(rotatedCamera, controlsMap);

window.addEventListener("click", e => {
  if (e.target === domElement.value) viewFocused.value = true;
  else viewFocused.value = false;
});

onMounted(() => {
  async function autoresize(size) {
    renderer.value.setSize(size.width, size.height);
    fixedCamera.updateAspect(size.width / size.height);
    rotatedCamera.updateAspect(size.width / size.height);
  }

  controller.onControl(() => viewFocused.value, domElement.value);
  renderer.value = new THREE.WebGLRenderer({ canvas: domElement.value });
  autoresize(props.size);
  renderer.value.setPixelRatio(window.devicePixelRatio);

  watch(() => props.size, autoresize, { deep: true });
  watch(
    () => props.config.orbit,
    async show => scene.configOrbits(show)
  );
  watch(
    () => props.config.fixedCamera,
    async is => {
      camera = is ? fixedCamera : rotatedCamera;
      controller.reset(camera);
    }
  );

  let previousTime = 0;
  function animate(time) {
    const ts = time / 1000 - previousTime;
    previousTime = time / 1000;
    controller.update(ts, 35);
    scene.update(ts);

    renderer.value.render(scene.inst, camera.inst);
  }

  renderer.value.setAnimationLoop(animate);
});

onUnmounted(() => {
  renderer.value.dispose();
  renderer.value.forceContextLoss();
});
</script>

<template>
  <div class="container">
    <canvas
      :class="viewFocused ? 'outline-border' : ''"
      id="planets-space"
      ref="domElement"
    ></canvas>
    <span v-cloak>{{ viewFocused ? "Focused" : "Lost [click to focus]" }}</span>
  </div>
</template>

<style scoped>
#planets-space {
  width: 100%;
  height: 100%;
}

.outline-border {
  outline: 0.2em solid rgb(98, 98, 134);
  outline-offset: 0.2em;
}

.container {
  position: relative;
}

.container span {
  display: block;
  position: absolute;
  left: 2em;
  bottom: 1em;
  color: rgb(121, 188, 148);
  z-index: 100;
}
</style>
