import * as THREE from "three";
import { Vector3 } from "three";

const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 800;

class SpaceCamera {
  constructor(fov, aspect) {
    this.inst = new THREE.PerspectiveCamera(fov, aspect, CAMERA_NEAR, CAMERA_FAR);
    this.inst.position.set(0, 5, 150);
  }

  updateAspect(aspect) {
    this.inst.aspect = aspect;
    this.inst.updateProjectionMatrix();
  }

  setPosition(...args) {
    this.inst.position.set(...args);
  }

  reset(position, direction) {}
  goForward(dis) {}
  moveToRight(dis) {}
  flyToTop(dis) {}
  lookToUp(angle) {}
  lookToRight(angle) {}
}

class SpaceCameraController {
  static #s_SortedState = ["forward", "right", "up", "back", "left", "down"];
  #camera;
  #keymap;
  #controlKeyState = new Array(6).fill(false);

  constructor(camera, keymap) {
    this.#camera = camera;
    this.#keymap = keymap;
  }

  reset(camera) {
    this.#camera = camera;
  }

  clear() {
    this.#controlKeyState.fill(false);
  }

  update(ts, speed) {
    const distances = this.#controlKeyState.map(state => (state ? ts * speed : 0));
    // console.log(distances);
    this.#camera.goForward(distances[0] - distances[3]);
    this.#camera.moveToRight(distances[1] - distances[4]);
    this.#camera.flyToTop(distances[2] - distances[5]);
  }

  onControl(checker, receiver) {
    window.addEventListener("keydown", e => {
      if (checker() === false) return;
      if (e.repeat === true) return;
      this.#updateKeyState(e.key, true);
      //   console.log("down: ", e.key, motion);
    });

    window.addEventListener("keyup", e => {
      if (checker() === false) return;
      this.#updateKeyState(e.key, false);
      //   console.log("up: ", e.key, motion);
    });

    receiver.addEventListener("mousemove", e => {
      if (e.buttons === 1) {
        this.#camera.lookToRight(e.movementX / 720);
        this.#camera.lookToUp(e.movementY / 720);
      }
    });
  }

  #updateKeyState(key, state) {
    const [motion] = Object.entries(this.#keymap).find(([, value]) => value === key) || [];
    const index = SpaceCameraController.#s_SortedState.findIndex(item => item === motion);
    this.#controlKeyState[index] = state;
  }
}

class FixedCamera extends SpaceCamera {
  static #LIMIT_PITCH = Math.PI * 0.9;
  #yaw = 0;
  #pitch = 0;

  constructor(...args) {
    super(...args);
  }

  reset(position, direction) {
    this.goForward(position.z);
    this.moveToRight(position.x);
    this.flyToTop(position.y);

    const vector3DTemp = new THREE.Vector3(direction.x, direction.y, 0);
    const yaw = vector3DTemp.angleTo(new Vector3(0, 0, -1));
    const pitch = vector3DTemp.angleTo(direction);
    this.lookToRight(yaw);
    this.lookToUp(pitch);
  }

  goForward(dis) {
    this.inst.position.z -= dis * Math.cos(this.#yaw);
    this.inst.position.x -= dis * Math.sin(this.#yaw);
  }

  moveToRight(dis) {
    this.inst.translateX(dis);
  }

  flyToTop(dis) {
    this.inst.position.y += dis;
  }

  lookToUp(angle) {
    const newPitch = this.#pitch + angle;
    if (newPitch < -FixedCamera.#LIMIT_PITCH) this.#pitch = -FixedCamera.#LIMIT_PITCH;
    else if (newPitch < FixedCamera.#LIMIT_PITCH) this.#pitch = newPitch;
    else this.#pitch = FixedCamera.#LIMIT_PITCH;
    this.inst.rotateX(angle);
  }

  lookToRight(angle) {
    this.#yaw = (this.#yaw + angle) % Math.PI;
    this.inst.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
  }
}

class RotatedCamera extends SpaceCamera {
  constructor(...args) {
    super(...args);
  }

  reset(position, direction) {
    this.position.set(position);
    this.inst.lookAt(direction);
  }

  moveToRight(dis) {
    this.inst.translateX(dis);
  }

  flyToTop(dis) {
    this.inst.translateY(dis);
  }

  goForward(dis) {
    this.inst.translateZ(-dis);
  }

  lookToUp(angle) {
    this.inst.rotateX(angle);
  }

  lookToRight(angle) {
    this.inst.rotateY(angle);
  }

  rotateView(angle) {
    this.inst.rotateZ(angle);
  }
}

export default { SpaceCamera, SpaceCameraController, FixedCamera, RotatedCamera };
