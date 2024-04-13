import * as THREE from "../node_modules/three/build/three.module.js";
import { player, cameraRotation } from "./player.js";
// Crear la cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, -10);

// Actualizar la posición de la cámara para seguir al jugador
function updateCamera() {
 camera.position.x = player.position.x - 10 * Math.sin(cameraRotation);
 camera.position.z = player.position.z - 10 * Math.cos(cameraRotation);
 camera.lookAt(player.position);
}

export { camera, updateCamera };
