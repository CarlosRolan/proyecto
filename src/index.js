// Crear la escena
import * as THREE from "../node_modules/three/build/three.module.js";
import {
  player,
  updatePlayer,
  onKeyDown,
  onKeyUp,
  onMouseDown,
  onMouseMove,
  onMouseUp,
} from "./player.js";

import { camera, updateCamera } from "./camera.js";
import { mazeObject } from "./maze.js";
import { ground } from "./ground.js";

function initRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

function initScene() {
  const scene = new THREE.Scene();
  scene.add(mazeObject);
  scene.add(player);
  scene.add(ground);

  return scene;
}

// Crear el renderizador
const renderer = initRenderer();
const scene = initScene();

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
window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);
window.addEventListener("mousemove", onMouseMove, false);

// Control de teclado para mover al jugador
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

// Llamar a la función de animación
animate();

document.body.appendChild(renderer.domElement);
