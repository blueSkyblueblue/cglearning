<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import planetsInfromation from "./js/PlanetsInformation.js";

const props = defineProps(["setting", "fullscreen"]);

const rendererDom = ref(null);
let renderer = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 800);

const planets = [];
const orbits = [];

// watch(props.fullscreen, async current => {
//   console.log("Receive Event (fullscreen)", current);

//   let width = window.innerWidth;
//   let height = window.innerHeight;
//   if (current === false) {
//     width = computeEdgeLength();
//     height = computeEdgeLength();
//   }

//   renderer.setSize(width, height);
//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
// });

let currentOrbitState = props.setting.showOrbit;
watch(props.setting, async current => {
  console.log("current", current);

  if (props.setting.showOrbit !== currentOrbitState) {
    currentOrbitState = props.setting.showOrbit;
    if (currentOrbitState === true) {
      planetsInfromation.forEach((item, i) => addOrbitToScene(orbits[i], item[1]));
    } else {
      removeOrbitsFromScene();
    }
  }

  if (props.setting.fixedUp !== CameraOptions.isUpFixed) {
    CameraOptions.isUpFixed = props.setting.fixedUp;
    CameraOptions.MOTIONS = CameraOptions.MOTION_STORAGE[Number(CameraOptions.isUpFixed)];
    CameraOptions.reset();
  }
});

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
  console.dir(rendererDom.value.parentElement);
  const width = window.innerWidth - 520;
  const height = window.innerHeight - 120;
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

  // Camera Transform
  window.addEventListener("keydown", e => {
    if (e.repeat === false) {
      const index = CameraOptions.MOTION_KEYS.indexOf(e.key);
      if (index >= 0) {
        CameraOptions.moving = true;
        CameraOptions.add(CameraOptions.MOTIONS[index]);
      }
    }
  });

  window.addEventListener("keyup", e => {
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
  setupSceneBackground(scene);
  planetsInfromation.forEach(item => addPlanetToScene(...item));
  planetsInfromation.forEach(item => generateOrbits(item[0].distance));
  setupEventHandler(renderer, camera);
}

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
  <canvas id="solarsystem-view" ref="rendererDom"></canvas>
</template>

<style scoped>
#solarsystem-view {
  width: 100%;
  height: 100%;
}
</style>
