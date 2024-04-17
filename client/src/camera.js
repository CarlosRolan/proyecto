import * as THREE from "/node_modules/three/build/three.module.js";
// Crear la cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, -10);

export { camera };
