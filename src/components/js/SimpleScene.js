import * as THREE from "three";
import { AmbientLight } from "three";
import { BufferGeometry } from "three";
import { Scene } from "three";

const EASY_UPDATE_PROPS = [
  "radius",
  "base",
  "distance",
  "color",
  "texture",
  "rotationSpeed",
  "revolutionSpeed",
];

class SimpleScene {
  static s_TextureLoader = new THREE.TextureLoader();
  #showOrbit = false;
  constructor(lightIntensity = 0.2) {
    this.planets = [];
    this.inst = new THREE.Scene();
    this.#setupBackground("textures/stars.jpg", lightIntensity);
  }

  #setupBackground(background, intensity) {
    const loader = new THREE.CubeTextureLoader();
    this.inst.background = loader.load(new Array(6).fill(background));
    this.inst.fog = new THREE.Fog(0x000000, 1, 1000);
    this.inst.add(new THREE.AmbientLight(0xffffff, intensity));
  }

  update(ts) {
    this.planets.forEach(item => {
      item.objs.mesh.rotation.y += ts * item.info.rotationSpeed;
      item.objs.system.rotation.y += ts * item.info.revolutionSpeed;
    });

    return this;
  }

  reset(planets) {
    this.clear();
    planets.forEach(planet => this.add(planet));
    return this;
  }

  clear() {
    this.inst.clear();
    this.planets.length = 0;
    return this;
  }

  configOrbits(show = false) {
    this.planets.forEach(item => {
      item.orbit = show;
      if (show) item.objs.system.add(item.objs.orbit);
      else item.objs.system.remove(item.objs.orbit);
    });

    this.#showOrbit = show;
    return this;
  }

  change(planet, n_info) {
    const info = planet.info;
    info.rotationSpeed = n_info.rotationSpeed;
    info.revolutionSpeed = n_info.revolutionSpeed;

    if (info.distance !== n_info.distance) {
      planet.objs.system.children.forEach(child => child.position.set(n_info.distance, 0, 0));
      planet.objs.orbit.position.set(0, 0, 0);
      if (info.distance !== 0) {
        planet.objs.orbit.scale.multiplyScalar(n_info.distance / info.distance);
      } else {
        console.log(planet.objs.orbit.geometry);
        planet.objs.orbit.geometry.setFromPoints(SimpleScene.#sampleOrbit(n_info.distance));
        planet.objs.orbit.scale.set(1, 1, 1);
      }

      info.distance = n_info.distance;
    }

    const n_baseplt = this.planets.find(item => item.info.name === n_info.base);
    if (info.base !== n_info.base) {
      if (n_info.base === "scene") {
        this.inst.add(planet.objs.system);
        planet.objs.system.position.set(0, 0, 0);
      } else {
        n_baseplt.objs.system.add(planet.objs.system);
        planet.objs.system.position.set(...n_baseplt.objs.mesh.position);
      }

      info.base = n_info.base;
    }

    if (info.radius !== n_info.radius) {
      const scalar = n_info.radius / info.radius;
      planet.objs.mesh.scale.multiplyScalar(scalar);
      info.radius = n_info.radius;
    }

    if (info.color != n_info.color) {
      planet.objs.mesh.material.color.set(info.color);
      info.color = n_info.color;
    }

    if (info.texture != n_info.texture) {
    }

    if (info.light != n_info.light) {
    }

    if (info.ring != n_info.ring) {
    }

    console.log(this);
  }

  add(planet) {
    console.log("add", planet);

    const mesh = SimpleScene.#createMesh(planet);
    if (planet.ring) {
      const ring = SimpleScene.#createMesh(planet.ring, false);
      mesh.add(ring);
      ring.rotateX((Math.PI * 3) / 7);
    }

    mesh.position.set(planet.distance, 0, 0);
    const system = new THREE.Object3D().add(mesh);

    if (planet.base === "scene") this.inst.add(system);
    else {
      const baseobjs = this.planets.find(item => item.info.name === planet.base).objs;
      baseobjs.system.add(system);
      system.position.set(...baseobjs.mesh.position);
    }

    const orbit = SimpleScene.#generateOrbit(planet.distance);
    if (this.#showOrbit) system.add(orbit);

    this.planets.push({
      info: planet,
      objs: { mesh, system, orbit },
      orbit: false,
    });

    return this;
  }

  remove(planet) {
    this.planets = this.planets.filter(item => {
      if (item.info.name === planet.name) {
        item.objs.system.removeFromParent();
        return false;
      }

      let basename = item.info.base;
      while (basename !== "scene") {
        if (basename === planet.name) return false;
      }

      return true;
    });

    return this;
  }

  static #generateOrbit(radius) {
    const points = SimpleScene.#sampleOrbit(radius);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "lightblue" });
    const orbit = new THREE.Line(geometry, material);

    return orbit;
  }

  static #sampleOrbit(radius) {
    const count = Math.ceil((radius + 20) / 1.5);
    const step = (Math.PI * 2) / count;

    const points = [];
    for (let i = 0; i <= count; i++) {
      const angle = i * step;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }

    return points;
  }

  static #createMesh(info, isSphere = true) {
    let geometry = null;
    let material = null;
    if (isSphere === true) geometry = new THREE.SphereGeometry(info.radius);
    else geometry = new THREE.RingGeometry(info.innerRadius, info.outerRadius);

    const hasLight = info.light ? true : false;
    const func = hasLight ? THREE.MeshBasicMaterial : THREE.MeshStandardMaterial;
    const side = isSphere ? THREE.FrontSide : THREE.DoubleSide;
    if (info.texture) {
      material = new func({
        map: SimpleScene.s_TextureLoader.load(info.texture),
        side,
      });
    } else {
      material = new func({ color: info.color, side });
    }

    const mesh = new THREE.Mesh(geometry, material);
    if (hasLight === true) {
      const light = new THREE.PointLight(info.light.color, info.light.intensity);
      light.castShadow = true;
      mesh.add(light);
    }

    if (!hasLight) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }

    return mesh;
  }
}

export default SimpleScene;
