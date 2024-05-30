<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as THREE from "three";
import CustomRenderer from "./js/CustomRenderer.js";

const rotation = defineModel("rotation");
const props = defineProps({ isRegular: Boolean, onUpdated: Boolean, vertices: Array });
const emit = defineEmits(["update-done"]);

const container = ref(null);
const threeView = []; // an array holding all three-view custom renderer (both renderer and camera)
let renderer = null;
const tetrahedrons = [];
let canvasLength = 0;
let tetrahedron = null;
let scene = new THREE.Scene();

watch(props, async () => {
  updateTetrahedron();
  emit("update-done");
});

function updateRotation(obj) {
  rotation.value.x = obj.rotation.x;
  rotation.value.y = obj.rotation.y;
  rotation.value.z = obj.rotation.z;
}

function setup() {
  canvasLength = Math.min(window.innerWidth * 0.28, window.innerHeight * 0.42);
  container.value.style.width = `${canvasLength * 2}px`;
  container.value.style.height = `${canvasLength * 2}px`;
}

function prepareTheScene() {
  scene.fog = new THREE.FogExp2("lightblue", 0.01);
  scene.background = new THREE.Color("lightblue");
  scene.add(new THREE.AxesHelper(10));
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  const directonalLight = new THREE.DirectionalLight(0xffffff, 5);
  directonalLight.position.set(7, 7, 7);
  scene.add(ambientLight, directonalLight);
}

function setTetrahedron() {
  const regularTetraGeometry = new THREE.TetrahedronGeometry(4);
  const phongMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
  });
  tetrahedrons.push(new THREE.Mesh(regularTetraGeometry, phongMaterial));

  const customTetraGeometry = new THREE.BufferGeometry();
  customTetraGeometry.setFromPoints(setTetrahedron.indices.map(index => props.vertices[index]));
  customTetraGeometry.computeVertexNormals();
  tetrahedrons.push(new THREE.Mesh(customTetraGeometry, phongMaterial));
  tetrahedrons.forEach(item => item.add(new THREE.AxesHelper(7)));

  tetrahedron = tetrahedrons[Number(!props.isRegular)];
  scene.add(tetrahedron);
}
setTetrahedron.indices = [0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3];

function updateTetrahedron() {
  scene.remove(tetrahedron);
  tetrahedron = tetrahedrons[Number(!props.isRegular)];
  scene.add(tetrahedron);

  if (props.isRegular === false) {
    console.log(tetrahedron);
    tetrahedron.geometry.setFromPoints(setTetrahedron.indices.map(index => props.vertices[index]));
    tetrahedron.geometry.computeVertexNormals();
  }
}

function prepareTheObject() {
  threeView.push(new CustomRenderer(canvasLength, canvasLength, [10, 0, 0])); // Face to face
  threeView.push(new CustomRenderer(canvasLength, canvasLength, [0, 0, 10])); // Look down
  threeView.push(new CustomRenderer(canvasLength, canvasLength, [0, -10, 0])); // Look right
  renderer = new CustomRenderer(canvasLength, canvasLength, [10, 0, 0], true); // Perspective Projection
  renderer.domElement.classList.add("perspective-view");
  const labels = ["Main View", "Left View", "Top View"];
  threeView.forEach((renderer, index) =>
    container.value.appendChild(renderer.addLabel(labels[index]))
  ); // three-view
  container.value.appendChild(renderer.domElement); // perspective-view

  setTetrahedron();
}

function setupEventHandler(renderer) {
  renderer.domElement.addEventListener("mousemove", e => {
    console.log("mousemove: ", e);
    if (e.buttons === 1) {
      tetrahedron.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), e.movementY / 40);
      tetrahedron.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), e.movementX / 40);
      updateRotation(tetrahedron);
    }
  });

  renderer.domElement.addEventListener("wheel", e => {
    e.preventDefault();
    // rotation on the world z axis
    const rotation = 0.001 * e.wheelDelta;
    tetrahedron.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), rotation);
    updateRotation(tetrahedron);
  });

  // Handling window resize event.
  window.addEventListener("resize", () => {
    setup();
    threeView.forEach(item => item.resizeTo(canvasLength, canvasLength));
    renderer.resizeTo(canvasLength, canvasLength);
  });
}

onMounted(() => {
  setup(); // setup the conainer size and so on.
  prepareTheScene();
  prepareTheObject();
  setupEventHandler(renderer);

  function animate(time) {
    threeView.forEach(renderer => renderer.onDraw(scene));
    renderer.onDraw(scene);
  }

  renderer.renderer.setAnimationLoop(animate);
});

onUnmounted(() => {
  threeView.forEach(renderer => {
    renderer.renderer.dispose();
    renderer.renderer.forceContextLoss();
  });

  renderer.renderer.dispose();
  renderer.renderer.forceContextLoss();
});
</script>

<template>
  <div id="three-view-container" ref="container"></div>
</template>

<style scoped>
#three-view-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
</style>

<style>
.perspective-view {
  background-color: aliceblue;
  box-sizing: border-box;
  border: 2px solid gray;
}

#three-view-container > .part {
  position: relative;
}

#three-view-container > .part > .label {
  position: absolute;
  top: 10%;
  left: 10%;
  font-size: 16px;
  color: darkcyan;
}
</style>
