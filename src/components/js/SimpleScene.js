import * as THREE from "three";

class SimpleScene {
  static s_TextureLoader = new THREE.TextureLoader();
  constructor(lightIntensity = 0.1) {
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
    console.log(planets);
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

    return this;
  }

  add(planet) {
    const mesh = SimpleScene.#createMesh(planet);
    if ("ring" in planet) {
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
    function sampleOrbit(radius) {
      const count = Math.ceil((radius + 20) / 1.5);
      const step = (Math.PI * 2) / count;

      const points = [];
      for (let i = 0; i <= count; i++) {
        const angle = i * step;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
      }

      return points;
    }

    const points = sampleOrbit(radius);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "lightblue" });
    const orbit = new THREE.Line(geometry, material);

    return orbit;
  }

  static #createMesh(info, isSphere = true) {
    let geometry = null;
    let material = null;
    if (isSphere === true) geometry = new THREE.SphereGeometry(info.radius);
    else geometry = new THREE.RingGeometry(info.innerRadius, info.outerRadius);

    const hasLight = "light" in info;
    const func = hasLight ? THREE.MeshBasicMaterial : THREE.MeshStandardMaterial;
    const side = isSphere ? THREE.FrontSide : THREE.DoubleSide;
    if ("texture" in info) {
      material = new func({
        map: SimpleScene.s_TextureLoader.load(info.texture),
        side,
      });
    } else {
      material = new func({ color: info.color, side });
    }

    const mesh = new THREE.Mesh(geometry, material);
    if (hasLight === true) {
      mesh.add(new THREE.PointLight(info.light.color, info.light.intensity));
    }

    return mesh;
  }
}

export default SimpleScene;
