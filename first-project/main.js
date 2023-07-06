import "./style.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import * as dat from "dat.gui";
import bg1 from "/bg1.jpg";
import bg2 from "/bg2.jpg";
import bg3 from "/bg3.jpg";
import bg4 from "/bg4.jpg";
import bg5 from "/bg5.jpg";
import bg6 from "/bg6.jpg";
import starsBg from "/stars.jpg";

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(3);

const camera = new THREE.PerspectiveCamera(
  45, // field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-10, 30, 30);
controls.update();

scene.add(axesHelper);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 24, 24);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// directionalLight.position.set(-20, 30, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -10;
// directionalLight.shadow.camera.top = 10;
// scene.add(directionalLight);

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff, 0.8);
spotLight.position.set(-50, 50, 0);
spotLight.castShadow = true;
spotLight.angle = Math.PI / 8;
scene.add(spotLight);

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0x000000, 1, 1000); // linear fog
scene.fog = new THREE.FogExp2(0x000000, 0.005); // exponential fog

// renderer.setClearColor(0x007777);
// scene.background = new THREE.Color(0x770077);

const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(starsBg);

const box2Geometry = new THREE.BoxGeometry(3, 3, 3);
const box2Material = new THREE.MeshBasicMaterial({
  map: textureLoader.load(bg6),
});
const box2 = new THREE.Mesh(box2Geometry, box2Material);
box2.position.set(10, 3, 0);
scene.add(box2);

const multiMaterial = [
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(bg1),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(bg2),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(bg3),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(bg4),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(bg5),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(bg6),
  }),
];

box2.material = multiMaterial;

const gui = new dat.GUI();
const options = {
  sphereColor: "#0000ff",
  wireframe: false,
  speed: 0.01,
  slAngle: Math.PI / 8,
  slPenumbra: 0,
  slIntensity: 0.8,
};
gui.addColor(options, "sphereColor").onChange((color) => {
  sphere.material.color.set(color);
});
gui.add(options, "wireframe").onChange((wireframe) => {
  sphere.material.wireframe = wireframe;
});
gui.add(options, "speed", 0, 0.1);
gui.add(options, "slAngle", 0, Math.PI / 2);
gui.add(options, "slPenumbra", 0, 1);
gui.add(options, "slIntensity", 0, 1);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

const spherId = sphere.id;

box2.name = "box";

const plane2 = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 10, 10),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  })
);

plane2.position.set(0, 10, 10);

scene.add(plane2);

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate(time) {
  box.rotation.x = time / 2000;
  box.rotation.y = time / 1000;

  spotLight.angle = options.slAngle;
  spotLight.penumbra = options.slPenumbra;
  spotLight.intensity = options.slIntensity;
  sLightHelper.update();

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step)) + 4;

  raycaster.setFromCamera(mousePosition, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === spherId) {
      intersects[i].object.material.color.set(0xff0000);
    }
    if (intersects[i].object.name === "box") {
      //   rotate
      intersects[i].object.rotation.x += 0.01;
      intersects[i].object.rotation.y += 0.01;
    }
  }
  //   plane2.geometry.attributes.position.array[0] += Math.random() * 4;
  //   plane2.geometry.attributes.position.array[1] += Math.random() * 4;
  //   plane2.geometry.attributes.position.array[2] += Math.random() * 4;
  //   plane2.geometry.attributes.position.needsUpdate = true;

  // add wave effect to plane2
  for (let i = 0; i < plane2.geometry.attributes.position.count; i++) {
    const y = time * 0.001 + i * 0.02;
    const x = time * 0.001 + i * 0.02;
    plane2.geometry.attributes.position.setZ(i, Math.sin(x) + Math.cos(y));
  }
  plane2.geometry.attributes.position.needsUpdate = true;

  stats.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
