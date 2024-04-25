<script setup>
import { Static, onMounted, ref } from "vue";
import * as THREE from "three";

const cvs = ref(null);
let cvsWidth = 0;
let cvsHeight = 0;

function logInfo() {
  // Just for testing (debug thing)
  console.log(cvs.value.clientWidth, cvs.value.clientHeight);
  console.log("Window Device Pixel Ratio: ", window.devicePixelRatio);
}

function containerSetup() {
  const sideLength = Math.min(
    window.innerWidth * 0.28,
    window.innerHeight * 0.42
  );

  cvsWidth = sideLength;
  cvsHeight = sideLength;
  cvs.value.style.width = `${sideLength * 2}px`;
  cvs.value.style.height = `${sideLength * 2}px`;
}

class CustomRenderer {
  // This Renderer's Camera always look at the origin of the world coordinate system
  static near = 0.1;
  static far = 500;

  constructor(width, height, cameraPos, perspective = false) {
    this.width = width;
    this.height = height;
    this.renderer = this.genRenderer(width, height);
    this.camera = this.genCamera(cameraPos, perspective);
  }

  get domElement() {
    return this.renderer.domElement;
  }

  resizeTo(width, height) {
    this.renderer.setSize(width, height);

    const aspect = width / height;
    if (this.camera.isPerspectiveCamera) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    }

    if (this.camera.isOrthographicCamera) {
      this.camera.top = this.distance / aspect;
      this.camera.bottom = -this.distance / aspect;
    }

    this.camera.updateProjectionMatrix();
  }

  genRenderer(width, height) {
    const renderer = new THREE.WebGLRenderer(); // Create WebGL (based on OpenGL) Renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    return renderer;
  }

  genCamera(position, perspective) {
    // Generate a special camera for this renderer
    const distance = Math.sqrt(
      position.reduce((accumulator, value) => accumulator + value * value, 0)
    );
    this.distance = distance;

    let camera = null;
    const aspect = cvsWidth / cvsHeight;

    if (perspective === true) {
      camera = new THREE.PerspectiveCamera( // Camera (Perspective)
        75,
        aspect,
        CustomRenderer.near,
        CustomRenderer.far
      );
    } else {
      camera = new THREE.OrthographicCamera(
        -distance,
        distance,
        distance / aspect,
        -distance / aspect,
        CustomRenderer.near,
        CustomRenderer.far
      );
    }

    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    return camera;
  }

  onDraw(scene) {
    // renderer things in scene to the domElement
    this.renderer.render(scene, this.camera);
  }
}

onMounted(() => {
  containerSetup(); // setup the conainer size and so on.
  logInfo(); // log information about the canvas container's client size

  const threeView = []; // an array holding all three-view custom renderer (both renderer and camera)
  threeView.push(new CustomRenderer(cvsWidth, cvsHeight, [0, 0, 6])); // Face to face
  threeView.push(new CustomRenderer(cvsWidth, cvsHeight, [0, 6, 0])); // Look down
  threeView.push(new CustomRenderer(cvsWidth, cvsHeight, [-6, 0, 0])); // Look right

  const renderer = new CustomRenderer(cvsWidth, cvsHeight, [0, 0, 6], true); // Perspective Projection

  // ================ The Scene =======================
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("lightblue", 0.1);
  scene.background = new THREE.Color("lightblue");
  // ==================================================

  // Add style to the perspective renderer document object element to make it more recoginizable.
  renderer.domElement.classList.add("perspective-view");

  // Append all the renderers' domElements the the canvas container.
  threeView.forEach(renderer => cvs.value.appendChild(renderer.domElement)); // three-view
  cvs.value.appendChild(renderer.domElement); // perspective-view

  // Add Ambient light and Directional light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  const directonalLight = new THREE.DirectionalLight(0xffffff, 5);
  directonalLight.position.set(2, 2, 2);
  scene.add(ambientLight, directonalLight);

  // Directional light's helper
  const directonalLightHelper = new THREE.DirectionalLightHelper(
    directonalLight
  );
  scene.add(directonalLightHelper);

  // Tetrahedron Object
  const tetraGeometry = new THREE.TetrahedronGeometry(2);
  const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const tetrahedron = new THREE.Mesh(tetraGeometry, phongMaterial);
  scene.add(tetrahedron);

  // Axes helpers
  const helper = new THREE.AxesHelper(5);
  scene.add(helper);
  const tetraHelper = new THREE.AxesHelper(5);
  tetrahedron.add(tetraHelper);

  // Add controls to the perspective renderer dom element.
  renderer.domElement.addEventListener("mousemove", e => {
    console.log("mousemove: ", e);
    if (e.buttons === 1) {
      // rotation on the world x axis
      tetrahedron.rotateOnWorldAxis(
        new THREE.Vector3(1, 0, 0),
        e.movementY / 40
      );

      // rotation on the world y axis
      tetrahedron.rotateOnWorldAxis(
        new THREE.Vector3(0, 1, 0),
        e.movementX / 40
      );
    }
  });

  // Handling window resize event.
  window.addEventListener("resize", () => {
    containerSetup();
    threeView.forEach(item => item.resizeTo(cvsWidth, cvsHeight));
    renderer.resizeTo(cvsWidth, cvsHeight);
  });

  function animate(time) {
    threeView.forEach(renderer => renderer.onDraw(scene));
    renderer.onDraw(scene);
  }

  renderer.renderer.setAnimationLoop(animate);
  console.log("Everthing works fine.");
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
</style>
