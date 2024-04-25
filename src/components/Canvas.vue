<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";

const cvs = ref(null);
let cvsWidth = 0;
let cvsHeight = 0;

const deviceRatio = window.devicePixelRatio;

function logInfo() {
  console.log(cvs.value.clientWidth, cvs.value.clientHeight);

  console.log("Window Device Pixel Ratio: ", deviceRatio);
}

onMounted(() => {
  cvsWidth = cvs.value.clientWidth / 2;
  cvsHeight = cvs.value.clientHeight / 2;

  const renderer = new THREE.WebGLRenderer(); // Renderer
  renderer.setSize(cvsWidth, cvsHeight);
  renderer.setViewport(cvsWidth, 0, cvsWidth, cvsHeight);
  renderer.setPixelRatio(deviceRatio);
  logInfo(); // log information about the canvas container's client size

  const rendererFace = new THREE.WebGLRenderer(); // Renderer
  rendererFace.setSize(cvsWidth, cvsHeight);
  rendererFace.setViewport(0, cvsHeight, cvsWidth, cvsHeight);
  rendererFace.setPixelRatio(deviceRatio);

  const rendererLeft = new THREE.WebGLRenderer(); // Renderer
  rendererLeft.setSize(cvsWidth, cvsHeight);
  rendererLeft.setViewport(0, 0, cvsWidth, cvsHeight);
  rendererLeft.setPixelRatio(deviceRatio);

  const rendererRight = new THREE.WebGLRenderer(); // Renderer
  rendererRight.setSize(cvsWidth, cvsHeight);
  rendererRight.setViewport(cvsWidth, cvsHeight, cvsWidth, cvsHeight);
  rendererRight.setPixelRatio(deviceRatio);

  const perspectiveCamera = new THREE.PerspectiveCamera( // Camera (Perspective)
    75,
    cvsWidth / cvsHeight,
    0.1,
    500
  );

  perspectiveCamera.position.set(0, 6, 0);
  perspectiveCamera.lookAt(0, 0, 0);
  perspectiveCamera.updateProjectionMatrix();

  // Orthographic Cameras (Face, Left, Right)
  const orthographicCameraFace = new THREE.OrthographicCamera(
    -5,
    5,
    5,
    -5,
    0.1,
    500
  );

  orthographicCameraFace.position.set(0, 6, 0);
  orthographicCameraFace.lookAt(0, 0, 0);
  orthographicCameraFace.updateProjectionMatrix();

  const orthographicCameraRight = new THREE.OrthographicCamera(
    -5,
    5,
    5,
    -5,
    0.1,
    500
  );

  orthographicCameraRight.position.set(-6, 0, 0);
  orthographicCameraRight.lookAt(0, 0, 0);
  orthographicCameraRight.updateProjectionMatrix();

  const orthographicCameraLeft = new THREE.OrthographicCamera(
    -5,
    5,
    5,
    -5,
    0.1,
    500
  );

  orthographicCameraLeft.position.set(0, 0, 6);
  orthographicCameraLeft.lookAt(0, 0, 0);
  orthographicCameraLeft.updateProjectionMatrix();

  // const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
  // const controlsFace = new OrbitControls(
  //   orthographicCameraFace,
  //   rendererFace.domElement
  // );

  const scene = new THREE.Scene(); // Scene
  scene.fog = new THREE.FogExp2("lightblue", 0.1);
  scene.background = new THREE.Color("lightblue");

  renderer.domElement.classList.add("top-margin");
  cvs.value.appendChild(rendererFace.domElement);
  cvs.value.appendChild(rendererRight.domElement);
  cvs.value.appendChild(rendererLeft.domElement);
  cvs.value.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directonalLight = new THREE.DirectionalLight(0xffffff, 10);
  directonalLight.position.set(10, 10, 2);
  scene.add(directonalLight);

  const tetraGeometry = new THREE.TetrahedronGeometry(2);
  const basicMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const tetrahedron = new THREE.Mesh(tetraGeometry, basicMaterial);
  scene.add(tetrahedron);

  rendererFace.domElement.addEventListener("mousemove", (e) => {
    console.log("drag: ", e);
    if (e.buttons === 1) {
      scene.rotation.x += e.movementY / 40;
      scene.rotation.z -= e.movementX / 40;
    }
  });

  const helper = new THREE.AxesHelper(5);
  scene.add(helper);
  const tetraHelper = new THREE.AxesHelper(5);
  tetrahedron.add(tetraHelper);

  window.addEventListener("resize", () => {
    cvsWidth = cvs.value.clientWidth;
    cvsHeight = cvs.value.clientHeight;

    rendererFace.setSize(cvsWidth, cvsHeight);
    rendererRight.setSize(cvsWidth, cvsHeight);
    rendererLeft.setSize(cvsWidth, cvsHeight);
    renderer.setSize(cvsWidth, cvsHeight);

    perspectiveCamera.aspect = cvsWidth / cvsHeight;
    perspectiveCamera.updateProjectionMatrix();
  });

  function animate(time) {
    // atom.rotation.y = time * 0.0005;
    // electOrbit.rotation.y = time * 0.001;

    rendererFace.render(scene, orthographicCameraFace);
    rendererRight.render(scene, orthographicCameraRight);
    rendererLeft.render(scene, orthographicCameraLeft);
    renderer.render(scene, perspectiveCamera);
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

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
</style>

<style>
.top-margin {
  margin: 0;
}
</style>
