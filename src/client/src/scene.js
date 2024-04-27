// Crear la escena
import * as THREE from "../../../node_modules/three/build/three.module.js";
import { enemies, p } from "./player.js";

import { camera } from "./camera.js";
import { maze } from "./maze.js";
import { ground } from "./ground.js";
import {
  mouseEvents,
  keyEvents,
  playerActions,
  cameraRotation,
} from "./controls.js";

import { renderer } from "./renderer.js";

import { sendPosition } from "./client.js";

const scene = new THREE.Scene();
scene.add(maze);
scene.add(p.mesh);
scene.add(ground);

// Actualizar la posición de la cámara para seguir al jugador
function updateCamera() {
  camera.position.x = p.mesh.position.x - 10 * Math.sin(cameraRotation);
  camera.position.z = p.mesh.position.z - 10 * Math.cos(cameraRotation);
  camera.lookAt(p.mesh.position);
}

function updatePlayer() {
  //Rotar al jugador
  // Actualizar la rotación del jugador para que coincida con la rotación de la cámara
  //const deltaRotation = -camera.rotation.y - player.rotation.y;
  //player.rotation.y += deltaRotation * 0.1;

  // Mover al jugador
  const newPos = playerActions.calculateNewPos(p.mesh.position);
  const newRotation = playerActions.getRotation();

  //WE CHECK IF POSITION HAS CHANGED
  if (
    newPos.x != p.mesh.position.x ||
    newPos.y != p.mesh.position.y ||
    newPos.z != p.mesh.position.z ||
    newRotation != p.mesh.rotation.y
  ) {
    p.rotate(newRotation);
    p.move(newPos.x, newPos.y, newPos.z);

    const newPosition = {
      id: p.id,
      position: p.mesh.position,
      rotation: p.mesh.rotation.y,
    };

    sendPosition(JSON.stringify(newPosition));
  }
}

function updateEnemies(enemies) {
  enemies.forEach((enemy) => {
    scene.add(enemy.mesh);
  });
}

function addEnemy(enemy) {
  enemies.add(enemy);
}

function deleteEnemy(enemyId) {
  enemies.forEach((e) => {
    if (e.id == enemyId) {
      enemies.delete(e);
      const toDel = scene.getObjectByName(enemyId);
      scene.remove(toDel);
      return;
    }
  });
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

export { animate, updateEnemies, deleteEnemy, addEnemy };
