// Crear la escena
import * as THREE from "../node_modules/three/build/three.module.js";
import { player } from "./player.js";

import { camera } from "./camera.js";
import { maze } from "./maze.js";
import { ground } from "./ground.js";
import { mouseEvents, keyEvents, playerActions, cameraRotation, playerRotation } from "./controls.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.add(maze);
scene.add(player);
scene.add(ground);

// Actualizar la posición de la cámara para seguir al jugador
function updateCamera() {
  camera.position.x = player.position.x - 10 * Math.sin(cameraRotation);
  camera.position.z = player.position.z - 10 * Math.cos(cameraRotation);
  camera.lookAt(player.position);
}

function updatePlayer() {
  // Mover al jugador
  playerActions.movePlayer(player);

  // Actualizar la rotación del jugador para que coincida con la rotación de la cámara
  //const deltaRotation = -camera.rotation.y - player.rotation.y;
  //player.rotation.y += deltaRotation * 0.1;
  player.rotation.y = playerRotation;
}

// Animar la escena
function animate() {
  requestAnimationFrame(animate);

  updatePlayer();
  updateCamera();

  // Renderizar la escena
  renderer.render(scene, camera);
}

function isPlayerOnGround(x, z) {
  // Verificamos si el jugador está dentro de los límites del suelo
  return x >= -9.5 && x <= 9.5 && z >= -9.5 && z <= 9.5;
}

// Event listeners para el control de ratón
window.addEventListener("mousedown", mouseEvents.onMouseDown, true);
window.addEventListener("mouseup", mouseEvents.onMouseUp, false);
window.addEventListener("mousemove", mouseEvents.onMouseMove, true);

// Control de teclado para mover al jugador
window.addEventListener("keydown", keyEvents.onKeyDown, false);
window.addEventListener("keyup", keyEvents.onKeyUp, false);

document.body.appendChild(renderer.domElement);

// Llamar a la función de animación
animate();