<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const cvs = ref(null);
let cvsWidth = 0;
let cvsHeight = 0;

const deviceRatio = window.devicePixelRatio;

function logInfo() {
  console.log(cvs.value.clientWidth, cvs.value.clientHeight);

  console.log("Window Device Pixel Ratio: ", deviceRatio);
}

onMounted(() => {
  cvsWidth = cvs.value.clientWidth;
  cvsHeight = cvs.value.clientHeight;

  const renderer = new THREE.WebGLRenderer(); // Renderer
  renderer.setSize(cvsWidth, cvsHeight);
  logInfo(); // log information about the canvas container's client size

  const camera = new THREE.PerspectiveCamera( // Camera (Perspective)
    75,
    cvsWidth / cvsHeight,
    0.1,
    500
  );

  camera.position.set(0, 6, 0);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  const controls = new OrbitControls(camera, renderer.domElement);

  const scene = new THREE.Scene(); // Scene
  scene.fog = new THREE.FogExp2("lightblue", 0.1);
  scene.background = new THREE.Color("lightblue");

  renderer.domElement.classList.add("top-margin");
  cvs.value.appendChild(renderer.domElement);

  const atomGeometry = new THREE.SphereGeometry(1);
  const yellowMaterial = new THREE.MeshBasicMaterial({
    color: "yellow",
    wireframe: false,
  });
  const atom = new THREE.Mesh(atomGeometry, yellowMaterial);
  scene.add(atom);

  const electronGeometry = new THREE.SphereGeometry(0.2);
  const purpleMaterial = new THREE.MeshBasicMaterial({ color: "purple" });
  const electron = new THREE.Mesh(electronGeometry, purpleMaterial);

  const electOrbit = new THREE.Object3D();
  electOrbit.add(electron);
  scene.add(electOrbit);

  electron.position.set(3, 0, 0);

  window.addEventListener("resize", () => {
    cvsWidth = cvs.value.clientWidth;
    cvsHeight = cvs.value.clientHeight;

    renderer.setSize(cvsWidth, cvsHeight);
    camera.aspect = cvsWidth / cvsHeight;
    camera.updateProjectionMatrix();
  });

  function animate(time) {
    atom.rotation.y = time * 0.0005;
    electOrbit.rotation.y = time * 0.001;

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);

  console.log("Everthing works fine.");
});
</script>

<template>
  <div id="container" ref="cvs"></div>
</template>

<style scoped>
#container {
  width: 80%;
  height: 70vh;
  margin: auto;
  background-color: antiquewhite;
}
</style>

<style>
.top-margin {
  margin-top: 2em;
}
</style>
