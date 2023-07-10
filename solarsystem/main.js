import "./style.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import earthTextrure from "/earth.jpg";
import jupiterTextrure from "/jupiter.jpg";
import marsTextrure from "/mars.jpg";
import mercuryTextrure from "/mercury.jpg";
import neptuneTextrure from "/neptune.jpg";
import saturnTextrure from "/saturn.jpg";
import nebulaTextrure from "/nebula.jpg";
import starsTextrure from "/stars.jpg";
import uranusTextrure from "/uranus.jpg";
import venusTextrure from "/venus.jpg";
import sunTextrure from "/sun.jpg";
import saturnRingTextrure from "/saturn-ring.jpg";

class Scene {
  renderer;
  scene;
  camera = new THREE.PerspectiveCamera(
    75, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );
  textureLoader = new THREE.TextureLoader();
  cubeTextureLoader = new THREE.CubeTextureLoader();

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
    this.camera.position.set(0, 10, 100);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    // add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    this.scene.add(ambientLight);

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

const { scene, camera, renderer, stats, cubeTextureLoader, textureLoader } =
  new Scene();

cubeTextureLoader.load(Array(6).fill(starsTextrure), (texture) => {
  scene.background = texture;
});

const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTextrure),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
10;

// add point light
const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const TIME_COEFFICIENT = 0.001;
const EarthDistanceFromSun = 20;

const { updateCallback: earthUpdate } = createPlanete({
  texture: earthTextrure,
  radius: 1,
  distanceFromSun: EarthDistanceFromSun,
});

const { updateCallback: jupiterUpdate } = createPlanete({
  texture: jupiterTextrure,
  radius: 2,
  distanceFromSun: EarthDistanceFromSun * 5,
});

const { updateCallback: marsUpdate } = createPlanete({
  texture: marsTextrure,
  radius: 1,
  distanceFromSun: EarthDistanceFromSun * 1.5,
});

const { updateCallback: mercuryUpdate } = createPlanete({
  texture: mercuryTextrure,
  radius: 0.5,
  distanceFromSun: EarthDistanceFromSun * 0.5,
});

const { updateCallback: neptuneUpdate } = createPlanete({
  texture: neptuneTextrure,
  radius: 1.5,
  distanceFromSun: EarthDistanceFromSun * 7,
});

const { mesh: saturnMesh, updateCallback: saturnUpdate } = createPlanete({
  texture: saturnTextrure,
  radius: 2,
  distanceFromSun: EarthDistanceFromSun * 9,
});
// add saturn ring
const saturnRingGeometry = new THREE.RingGeometry(2.5, 3.5, 32);
const saturnRingMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load(saturnRingTextrure),
  side: THREE.DoubleSide,
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2;
saturnMesh.add(saturnRing);

const { updateCallback: uranusUpdate } = createPlanete({
  texture: uranusTextrure,
  radius: 1.5,
  distanceFromSun: EarthDistanceFromSun * 8,
});

const { updateCallback: venusUpdate } = createPlanete({
  texture: venusTextrure,
  radius: 1,
  distanceFromSun: EarthDistanceFromSun * 2,
});

function animate(time) {
  sun.rotation.y = time * TIME_COEFFICIENT;
  earthUpdate(time);
  jupiterUpdate(time);
  marsUpdate(time);
  mercuryUpdate(time);
  neptuneUpdate(time);
  saturnUpdate(time);
  uranusUpdate(time);
  venusUpdate(time);
  stats.update();
  camera.updateMatrixWorld();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

function createPlanete({ texture, radius, distanceFromSun }) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geometry, material);
  const orbit = new THREE.Object3D();
  orbit.add(mesh);
  mesh.position.set(distanceFromSun, 0, 0);
  scene.add(orbit);
  const updateCallback = (time) => {
    orbit.rotation.y =
      (time * TIME_COEFFICIENT * EarthDistanceFromSun) / distanceFromSun;
    mesh.rotation.y = time * TIME_COEFFICIENT * 2 * Math.PI;
  };
  return {
    geometry,
    material,
    mesh,
    orbit,
    updateCallback,
  };
}
