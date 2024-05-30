import * as THREE from "three";

class CustomRenderer {
  // This Renderer's Camera always look at the origin of the world coordinate system
  static near = 0.1;
  static far = 50;

  constructor(width, height, cameraPos, perspective = false) {
    this.width = width;
    this.height = height;
    this.renderer = this.genRenderer(width, height);
    this.camera = this.genCamera(cameraPos, perspective);
  }

  get domElement() {
    return this.renderer.domElement;
  }

  addLabel(text) {
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = text;

    const box = document.createElement("div");
    box.classList.add("part");

    box.appendChild(this.domElement);
    box.appendChild(label);
    return box;
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
    const aspect = this.width / this.height;

    if (perspective === true) {
      camera = new THREE.PerspectiveCamera(75, aspect, CustomRenderer.near, CustomRenderer.far); // Camera (Perspective)
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
    camera.up.set(0, 0, 1); // set the up axis for camera before calling lookAt function
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    return camera;
  }

  onDraw(scene) {
    // renderer things in scene to the domElement
    this.renderer.render(scene, this.camera);
  }
}

export default CustomRenderer;
