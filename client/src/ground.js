import * as THREE from "/node_modules/three/build/three.module.js";

function initGround() {
  // Crear un suelo
  const groundGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(groundGeometry, groundMaterial);
}

const ground = initGround();
ground.rotation.x = Math.PI / -2;

export { ground };
