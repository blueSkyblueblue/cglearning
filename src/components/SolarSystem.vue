<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";

// Testing
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Texture } from "three";

const container = ref(null);

function computeEdgeLength() {
  return Math.min(window.innerWidth, window.innerHeight);
}

function setupEventHandler(renderer) {
  window.addEventListener("resize", () => {
    const edgeLength = computeEdgeLength();
    renderer.setSize(edgeLength, edgeLength);
  });
}

onMounted(() => {
  const renderer = new THREE.WebGLRenderer();
  const edgeLength = computeEdgeLength();
  renderer.setSize(edgeLength, edgeLength);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const loader = new THREE.CubeTextureLoader();
  const backgroundTexture = loader.load([
    "textures/background1.png",
    "textures/background1.png",
    "textures/background1.png",
    "textures/background1.png",
    "textures/background1.png",
    "textures/background1.png",
  ]);

  scene.background = backgroundTexture;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(0, 0, 50);

  const controls = new OrbitControls(camera, renderer.domElement);

  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);

  const sunGeometry = new THREE.SphereGeometry(2.5, 50, 50);
  const textureLoader = new THREE.TextureLoader();
  const sunSurface = textureLoader.load("textures/sunface.jpg");
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffff60,
    map: sunSurface,
  });

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  const sunLight = new THREE.PointLight("white", 2000);
  sunLight.position.set(0, 0, 0);
  sun.add(sunLight);
  sun.add(new THREE.PointLightHelper(sunLight, 10, 10));
  solarSystem.add(sun);

  const planetGeometry = new THREE.SphereGeometry(1);
  const planetMaterial = new THREE.MeshStandardMaterial({ color: "lightblue" });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.set(15, 0, 0);
  sun.add(planet);

  const satelliteSystem1 = new THREE.Object3D();
  planet.add(satelliteSystem1);

  const satelliteGeo1 = new THREE.SphereGeometry(0.3);
  const satelliteMat1 = new THREE.MeshStandardMaterial({ color: "brown" });
  const satellite1 = new THREE.Mesh(satelliteGeo1, satelliteMat1);
  satellite1.position.set(2, 0, 0);
  satelliteSystem1.add(satellite1);

  const satelliteSystem2 = new THREE.Object3D();
  planet.add(satelliteSystem2);

  const satelliteGeo2 = new THREE.SphereGeometry(0.35);
  const satelliteMat2 = new THREE.MeshStandardMaterial({ color: "brown" });
  const satellite2 = new THREE.Mesh(satelliteGeo2, satelliteMat2);
  satellite2.position.set(3, 0, 0);
  satelliteSystem2.add(satellite2);

  function animate(time) {
    sun.rotation.z = time * 0.0005;
    satelliteSystem1.rotation.z = time * 0.004;
    satelliteSystem2.rotation.z = time * 0.003;

    renderer.render(scene, camera);
  }

  setupEventHandler(renderer);
  renderer.setAnimationLoop(animate);
});
</script>

<template>
  <div class="container" ref="container"></div>
</template>

<style scoped>
.container {
  width: 100%;
}
</style>

<style>
.container > canvas {
  margin: auto;
}
</style>
