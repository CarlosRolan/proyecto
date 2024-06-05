import * as THREE from "../../three/build/three.module.js";

// Initialize the ground directly
const groundGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
const groundMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / -2;

// Calculate random position within the boundaries of the ground
const minX = -groundGeometry.parameters.width / 2;
const maxX = groundGeometry.parameters.width / 2;
const minZ = -groundGeometry.parameters.height / 2;
const maxZ = groundGeometry.parameters.height / 2;

const randomX = Math.random() * (maxX - minX) + minX;
const randomZ = Math.random() * (maxZ - minZ) + minZ;


export { ground };
