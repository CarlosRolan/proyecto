import * as THREE from "../node_modules/three/build/three.module.js";

const player = initPlayer();
player.position.set(-95, 0.5, -95);

// Control de teclado para mover al jugador
const moveSpeed = 0.1;
const keys = {
  W: false,
  A: false,
  S: false,
  D: false,
};

function initPlayer() {
  // Crear un cubo para representar al jugador
  const geometry = new THREE.BoxGeometry();
  const material = [
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Derecha (frente)
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Izquierda (frente)
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Arriba (frente)
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Abajo (frente)
    new THREE.MeshBasicMaterial({ color: 0x000000 }), // Frente (mirando hacia aquí)
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Atrás
  ];
  return new THREE.Mesh(geometry, material);
}

export { player };
