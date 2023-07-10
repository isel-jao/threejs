import "./style.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class Scene {
  renderer;
  scene;
  camera = new THREE.PerspectiveCamera(
    75, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    // add scene
    this.scene = new THREE.Scene();

    // add camera
    this.camera = new THREE.PerspectiveCamera(
      75, // field of view
      window.innerWidth / window.innerHeight, // aspect ratio
      0.1, // near clipping plane
      1000 // far clipping plane
    );
    this.camera.position.set(5, 10, 10);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    // add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // add grid helper
    const gridHelper = new THREE.GridHelper(30, 30);
    this.scene.add(gridHelper);

    // add stats
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    // add controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    // // add renderer
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // add resize listener
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}

const { scene, camera, renderer, stats } = new Scene();

const loader = new GLTFLoader();
loader.load(
  "/shiba/scene.gltf",
  function (gltf) {
    // scale the model to the correct size
    gltf.scene.scale.set(4, 4, 4);
    gltf.scene.position.set(0, 4, 0);
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  stats.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
