import * as THREE from "../../three/build/three.module.js";

// Initialize the ground directly
const groundGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
const groundMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / -2;

export { ground };
