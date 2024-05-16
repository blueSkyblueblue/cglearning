<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import CustomRenderer from "./js/CustomRenderer.js";

const cvs = ref(null);
const position = defineModel("position");
const rotation = defineModel("rotation");

// class ThreeViewApplication {
//   static s_Initialization = false;
//   static s_Props = defineProps({ isRegular: Boolean });
//   static s_Tetrahedrons = [];
//   static s_CurrentTetra = null;

//   static cvsWidth = 0;
//   static cvsHeight = 0;

//   initializeTetrahedrons() {
//     if (this.s_Initialization === false) {
//       this.s_Initialization = true;

//       const regularTetraGeometry = new THREE.TetrahedronGeometry(2);
//       const phongMaterial = new THREE.MeshPhongMaterial({
//         color: 0xaaaaaa,
//         side: THREE.DoubleSide,
//       });

//       this.s_Tetrahedrons.push(
//         new THREE.Mesh(regularTetraGeometry, phongMaterial)
//       );

//       const vertices = [
//         new THREE.Vector3(-2, -1, 0),
//         new THREE.Vector3(2, -1, 0),
//         new THREE.Vector3(0, 1, 2),
//         new THREE.Vector3(0, 1, -2),
//       ];

//       const indices = [0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3];

//       const customTetraGeometry = new THREE.BufferGeometry();
//       customTetraGeometry.setFromPoints(indices.map(index => vertices[index]));
//       customTetraGeometry.computeVertexNormals();

//       tetrahedrons.push(new THREE.Mesh(customTetraGeometry, phongMaterial));
//     }

//     tetrahedron = tetrahedrons[Number(!isRegular)];
//   }
// }

const props = defineProps({ isRegular: Boolean, vertices: Array });
let tetrahedronType = props.isRegular;
const vertices = props.vertices;

const tetrahedrons = [];
let tetrahedron = null;
let scene = null;
const threeView = []; // an array holding all three-view custom renderer (both renderer and camera)

let s_Initialization = false;
let cvsWidth = 0;
let cvsHeight = 0;

watch(props, async current => {
  console.log("current: ", current.isRegular);
  tetrahedronType = props.isRegular;
  setTetrahedron(scene, tetrahedronType);
});

function logInfo() {
  // Just for testing (debug thing)
  console.log(cvs.value.clientWidth, cvs.value.clientHeight);
  console.log("Window Device Pixel Ratio: ", window.devicePixelRatio);
}

function updateRotation(obj) {
  rotation.value.x = obj.rotation.x;
  rotation.value.y = obj.rotation.y;
  rotation.value.z = obj.rotation.z;
}

function containerSetup() {
  const sideLength = Math.min(window.innerWidth * 0.28, window.innerHeight * 0.42);

  cvsWidth = sideLength;
  cvsHeight = sideLength;
  cvs.value.style.width = `${sideLength * 2}px`;
  cvs.value.style.height = `${sideLength * 2}px`;
}

function lightSetup(scene) {
  // Add Ambient light and Directional light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  const directonalLight = new THREE.DirectionalLight(0xffffff, 5);
  directonalLight.position.set(2.5, 2.5, 2.5);
  scene.add(ambientLight, directonalLight);

  // Directional light's helper
  const directonalLightHelper = new THREE.DirectionalLightHelper(directonalLight);
  scene.add(directonalLightHelper);
}

function setTetrahedron(scene, isRegular = isRegular) {
  if (s_Initialization === false) {
    s_Initialization = true;

    const regularTetraGeometry = new THREE.TetrahedronGeometry(2);
    const phongMaterial = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      side: THREE.DoubleSide,
    });
    tetrahedrons.push(new THREE.Mesh(regularTetraGeometry, phongMaterial));

    const vertices = [
      new THREE.Vector3(-2, -1, 0),
      new THREE.Vector3(2, -1, 0),
      new THREE.Vector3(0, 1, 2),
      new THREE.Vector3(0, 1, -2),
    ];

    const indices = [0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3];

    const customTetraGeometry = new THREE.BufferGeometry();
    customTetraGeometry.setFromPoints(indices.map(index => vertices[index]));
    customTetraGeometry.computeVertexNormals();

    tetrahedrons.push(new THREE.Mesh(customTetraGeometry, phongMaterial));
    tetrahedron = tetrahedrons[Number(!isRegular)];
    scene.add(tetrahedron);
    return;
  }

  scene.remove(tetrahedron);
  tetrahedron = tetrahedrons[Number(!isRegular)];
  scene.add(tetrahedron);
}

function setupEventHandler(renderer) {
  // Add controls to the perspective renderer dom element.
  renderer.domElement.addEventListener("mousemove", e => {
    console.log("mousemove: ", e);
    if (e.buttons === 1) {
      // rotation on the world x axis
      tetrahedron.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), e.movementY / 40);

      // rotation on the world y axis
      tetrahedron.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), e.movementX / 40);

      updateRotation(tetrahedron);
    }
  });

  renderer.domElement.addEventListener("wheel", e => {
    e.preventDefault();
    // rotation on the world z axis
    if (e.wheelDelta > 0) {
      tetrahedron.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), 0.1);
      updateRotation(tetrahedron);
      return;
    }

    tetrahedron.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -0.1);
    updateRotation(tetrahedron);
  });

  // Handling window resize event.
  window.addEventListener("resize", () => {
    containerSetup();
    threeView.forEach(item => item.resizeTo(cvsWidth, cvsHeight));
    renderer.resizeTo(cvsWidth, cvsHeight);
  });
}

onMounted(() => {
  containerSetup(); // setup the conainer size and so on.
  logInfo(); // log information about the canvas container's client size

  threeView.push(new CustomRenderer(cvsWidth, cvsHeight, [0, 0, 6])); // Face to face
  threeView.push(new CustomRenderer(cvsWidth, cvsHeight, [0, 6, 0])); // Look down
  threeView.push(new CustomRenderer(cvsWidth, cvsHeight, [-6, 0, 0])); // Look right
  const renderer = new CustomRenderer(cvsWidth, cvsHeight, [0, 0, 6], true); // Perspective Projection

  // ================ The Scene =======================
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("lightblue", 0.1);
  scene.background = new THREE.Color("lightblue");
  lightSetup(scene);
  // ==================================================

  // Add style to the perspective renderer document object element to make it more recoginizable.
  renderer.domElement.classList.add("perspective-view");

  // Append all the renderers' domElements the the canvas container.
  const labels = ["Main View", "Left View", "Top View"];
  threeView.forEach((renderer, index) => cvs.value.appendChild(renderer.addLabel(labels[index]))); // three-view
  cvs.value.appendChild(renderer.domElement); // perspective-view

  // Tetrahedron Object
  setTetrahedron(scene, props.isRegular);

  // Axes helpers
  const helper = new THREE.AxesHelper(5);
  scene.add(helper);
  const tetraHelper = new THREE.AxesHelper(5);
  tetrahedron.add(tetraHelper);

  setupEventHandler(renderer);

  ////////////////////////////////////////////////////////////////////////////
  function animate(time) {
    threeView.forEach(renderer => renderer.onDraw(scene));
    renderer.onDraw(scene);
  }

  renderer.renderer.setAnimationLoop(animate);
  ////////////////////////////////////////////////////////////////////////////
});
</script>

<template>
  <div id="container" ref="cvs"></div>
</template>

<style scoped>
#container {
  margin: auto;
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

#container > .part {
  position: relative;
}

#container > .part > .label {
  position: absolute;
  top: 10%;
  left: 10%;
  font-size: 16px;
  color: darkcyan;
}
</style>
