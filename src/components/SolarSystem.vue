<script setup>
import { onMounted, onBeforeMount, ref, watch } from "vue";
import * as THREE from "three";

const emit = defineEmits(["update-done"]);
const props = defineProps({
  setting: { type: Object, required: true },
  planets: { type: Array, required: true },
  updated: { type: Boolean, required: false, default: false },
});

const viewFocused = ref(true);
const planetsInformation = props.planets;
const rendererDom = ref(null);
let renderer = null;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 800);
const planets = [];
const orbits = [];

let currentOrbitState = props.setting.showOrbit;
watch(props, async () => {
  if (props.setting.showOrbit !== currentOrbitState) {
    currentOrbitState = props.setting.showOrbit;
    if (currentOrbitState === true) {
      planetsInformation.forEach((item, i) => addOrbitToScene(orbits[i], item[1]));
    } else {
      removeOrbitsFromScene();
    }
  }

  if (props.setting.fixedUp !== CameraOptions.isUpFixed) {
    CameraOptions.isUpFixed = props.setting.fixedUp;
    CameraOptions.MOTIONS = CameraOptions.MOTION_STORAGE[Number(CameraOptions.isUpFixed)];
    CameraOptions.reset();
  }

  if (props.updated === true) updatingSystem();
});

function updatingSystem() {
  console.log("Updating: ----", props.planets);
  scene.clear();
  props.planets.forEach(item => addPlanetToScene(...item));
  props.planets.forEach(item => generateOrbits(item[0].distance));
  emit("update-done");
  console.log("Done ---------");
}

class CameraOptions {
  static speed = 30;
  static direction = { pitch: 0, yaw: 0 };
  static isUpFixed = props.setting.fixedUp;
  static moving = false;
  static moveFuncs = [];
  static MOTION_STORAGE = [
    [
      dis => camera.translateZ(-dis),
      dis => camera.translateZ(dis),
      dis => camera.translateX(-dis),
      dis => camera.translateX(dis),
      dis => camera.translateY(-dis),
      dis => camera.translateY(dis),
    ],
    [
      dis => {
        camera.position.z -= dis * Math.cos(this.direction.yaw);
        camera.position.x -= dis * Math.sin(this.direction.yaw);
      },
      dis => {
        camera.position.z += dis * Math.cos(this.direction.yaw);
        camera.position.x += dis * Math.sin(this.direction.yaw);
      },
      dis => camera.translateX(-dis),
      dis => camera.translateX(dis),
      dis => (camera.position.y += dis),
      dis => (camera.position.y -= dis),
    ],
  ];

  static MOTIONS = this.MOTION_STORAGE[0];

  static MOTION_KEYS = ["w", "s", "a", "d", "q", "e"];

  static add(motion) {
    this.moveFuncs.push(motion);
  }

  static remove(motion) {
    this.moveFuncs = this.moveFuncs.filter(func => func !== motion);
  }

  static reset() {
    camera.position.set(0, 5, 100);
    camera.rotation.set(0, 0, 0);
    CameraOptions.direction.yaw = 0;
    CameraOptions.direction.pitch = 0;
  }

  static rotateCamera(xoffset, yoffset) {
    if (this.isUpFixed === true) {
      this.direction.yaw += xoffset / 720;
      this.direction.pitch += yoffset / 720;

      camera.rotation.set(0, 0, 0);
      camera.rotateY(this.direction.yaw);
      camera.rotateX(this.direction.pitch);
      return;
    }

    camera.rotateX(yoffset / 720);
    camera.rotateY(xoffset / 720);
  }
}

function setupSceneBackground(scene) {
  const loader = new THREE.CubeTextureLoader();
  const backgroundTexture = loader.load([
    "textures/stars.jpg",
    "textures/stars.jpg",
    "textures/stars.jpg",
    "textures/stars.jpg",
    "textures/stars.jpg",
    "textures/stars.jpg",
  ]);

  const embientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(embientLight);
  scene.background = backgroundTexture;
  scene.fog = new THREE.Fog(0x000000, 1, 1000);
}

function generateOrbits(orbitRadius) {
  const createCirclePoints = function (radius) {
    const points = [];
    const count = Math.ceil((radius + 20) / 1.5);
    const radian = (Math.PI * 2) / count;

    for (let i = 0; i <= count; i++) {
      const v = new THREE.Vector3();
      v.x = Math.cos(i * radian) * radius;
      v.y = Math.sin(i * radian) * radius;
      points.push(v);
    }

    return points;
  };

  const orbitPoints = createCirclePoints(orbitRadius);
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: "lightblue" });
  const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
  orbit.position.set(0, 0, 0);
  orbit.rotateX(Math.PI / 2);
  const obj = new THREE.Object3D();
  obj.add(orbit);
  orbits.push(obj);
}

function addOrbitToScene(orbit, baseobj = "scene") {
  if (baseobj === "scene") return;
  const system = planets.find(item => item.name === baseobj + "-system").obj;
  const position = planets.find(item => item.name === baseobj).obj.position;
  orbit.position.set(...position);
  if (system === undefined) return;
  system.add(orbit);
}

function removeOrbitsFromScene() {
  orbits.forEach(item => item.removeFromParent());
}

function addPlanetToScene(planetInfo, baseobj = "scene", hasRing = false, hasLight = false) {
  let planetGeometry = null;
  let planetMaterial = null;
  if ("segments" in planetInfo) {
    const segments = planetInfo.segments;
    planetGeometry = new THREE.SphereGeometry(planetInfo.radius, segments[0], segments[1]);
  } else {
    planetGeometry = new THREE.SphereGeometry(planetInfo.radius);
  }

  if (hasLight === true) {
    if ("texture" in planetInfo) {
      planetMaterial = new THREE.MeshBasicMaterial({
        map: addPlanetToScene.textureLoader.load(planetInfo.texture),
      });
    } else {
      planetMaterial = new THREE.MeshBasicMaterial({ color: planetInfo.color });
    }
  } else {
    if ("texture" in planetInfo) {
      planetMaterial = new THREE.MeshStandardMaterial({
        map: addPlanetToScene.textureLoader.load(planetInfo.texture),
      });
    } else {
      planetMaterial = new THREE.MeshStandardMaterial({ color: planetInfo.color });
    }
  }

  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const obj = new THREE.Object3D();
  obj.position.set(0, 0, 0);
  planet.position.set(planetInfo.distance, 0, 0);

  if (hasLight === true) {
    const light = new THREE.PointLight(planetInfo.light.color, planetInfo.light.intensity);
    planet.add(light);
    light.position.set(0, 0, 0);
  }

  obj.add(planet);
  let system = scene;
  if (baseobj !== "scene") {
    system = planets.find(item => item.name === baseobj + "-system").obj;
    const position = planets.find(item => item.name === baseobj).obj.position;
    obj.position.set(...position);
  }
  if (system !== undefined) system.add(obj);

  if (hasRing === true) {
    const innerRadius = planetInfo.ring.innerRadius;
    const outerRadius = planetInfo.ring.outerRadius;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius);
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: addPlanetToScene.textureLoader.load(planetInfo.ring.texture),
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotateX((Math.PI * 3) / 7);
    ring.position.set(0, 0, 0);
    planet.add(ring);
  }

  let name = "planet";
  if ("name" in planetInfo) {
    name = planetInfo.name;
  }
  planets.push({ name: name + "-system", obj, rotateSpeed: planetInfo.rotateSpeed });
  planets.push({ name, obj: planet, rotateSpeed: planetInfo.selfRotateSpeed });
}
addPlanetToScene.textureLoader = new THREE.TextureLoader();

function autoresize() {
  let width = window.innerWidth - 370;
  if (window.innerWidth > 1180) width -= 150;
  let height = window.innerHeight - 120;
  if (width < 0 || height <= 0) {
    width = 0;
    height = 1;
  }
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function setupRenderer() {
  renderer = new THREE.WebGLRenderer({ canvas: rendererDom.value });
  renderer.setPixelRatio(window.devicePixelRatio);
  autoresize();
  camera.position.set(0, 5, 100);
}

function setupEventHandler() {
  window.addEventListener("resize", () => autoresize());
  window.addEventListener("click", e => {
    if (e.target === rendererDom.value) viewFocused.value = true;
    else viewFocused.value = false;
  });

  // Camera Transform
  window.addEventListener("keydown", e => {
    if (viewFocused.value === false) return;
    if (e.repeat === false) {
      const index = CameraOptions.MOTION_KEYS.indexOf(e.key);
      if (index >= 0) {
        CameraOptions.moving = true;
        CameraOptions.add(CameraOptions.MOTIONS[index]);
      }
    }
  });

  window.addEventListener("keyup", e => {
    if (viewFocused.value === false) return;
    const index = CameraOptions.MOTION_KEYS.indexOf(e.key);
    if (index >= 0) {
      CameraOptions.remove(CameraOptions.MOTIONS[index]);
    }

    if (CameraOptions.moveFuncs.length === 0) {
      CameraOptions.moving = false;
    }
  });

  renderer.domElement.addEventListener("mousemove", e => {
    if (e.buttons === 1) {
      CameraOptions.rotateCamera(e.movementX, e.movementY);
    }
  });
}

function prepareForAnimation() {
  setupRenderer();
  setupEventHandler();
}

// function updatePlanets(planetInfo) {
//   addPlanetToScene(...planetInfo);
//   generateOrbits(planetInfo[0].distance);
// }

onBeforeMount(() => {
  setupSceneBackground(scene);
  planetsInformation.forEach(item => addPlanetToScene(...item));
  planetsInformation.forEach(item => generateOrbits(item[0].distance));
});

onMounted(() => {
  prepareForAnimation();

  let lastTime = 0;
  function animate(time) {
    time /= 1000;
    const deltaTime = time - lastTime;
    lastTime = time;

    if (CameraOptions.moving === true) {
      CameraOptions.moveFuncs.forEach(move => move(deltaTime * CameraOptions.speed));
    }

    planets.forEach(item => (item.obj.rotation.y = time * item.rotateSpeed));
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
});
</script>

<template>
  <div class="container">
    <canvas :class="viewFocused ? 'outline-border' : ''" id="solarsystem-view" ref="rendererDom">
    </canvas>
    <span v-cloak>{{ viewFocused ? "Focused" : "Lost [click to focus]" }}</span>
  </div>
</template>

<style scoped>
#solarsystem-view {
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
