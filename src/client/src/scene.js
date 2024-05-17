import * as THREE from "../../../three/build/three.module.js";

// Crear la escena
import { enemies, p } from "./player.js";
import { spotLight } from "./light.js";
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
scene.add(spotLight);
scene.add(spotLight.target);

function handleCollisions(player, maze) {
  const playerBoundingBox = new THREE.Box3().setFromObject(player.mesh);
  const mazeBoundingBoxes = [];

  maze.traverse((child) => {
    if (child.isMesh) {
      const childBoundingBox = new THREE.Box3().setFromObject(child);
      mazeBoundingBoxes.push(childBoundingBox);
    }
  });

  // Check for intersections between player and maze walls
  for (const mazeBoundingBox of mazeBoundingBoxes) {
    // Ensure mazeBoundingBox is defined and not null
    if (mazeBoundingBox && mazeBoundingBox.min && mazeBoundingBox.max) {
      if (playerBoundingBox.intersectsBox(mazeBoundingBox)) {
        // Collision detected, determine collision direction
        const playerPosition = player.mesh.position.clone();
        const collisionDirection = new THREE.Vector3();

        // Ensure mazeBoundingBox's min and max are defined and not null
        if (mazeBoundingBox.min && mazeBoundingBox.max) {
          const center = new THREE.Vector3();
          center
            .addVectors(mazeBoundingBox.min, mazeBoundingBox.max)
            .multiplyScalar(0.5);
          collisionDirection.subVectors(playerPosition, center).normalize();
        }

        // Slide the player along the wall surface
        playerPosition.addScaledVector(collisionDirection, 0.1); // Adjust the sliding speed as needed
        player.mesh.position.copy(playerPosition);

        // Exit loop after handling the first collision
        return;
      }
    }
  }
}

// Define a function to check for collisions

// Actualizar la posición de la cámara para seguir al jugador
function updateCamera() {
  camera.position.x = p.mesh.position.x - 10 * Math.sin(cameraRotation);
  camera.position.z = p.mesh.position.z - 10 * Math.cos(cameraRotation);
  camera.lookAt(p.mesh.position);
}

function updatePlayer() {
  const newPos = playerActions.calculateNewPos(p.mesh.position);
  const newRotation = playerActions.getRotation();

  // Check if the new position and rotation are different from the current one
  if (
    newPos.x !== p.mesh.position.x ||
    newPos.y !== p.mesh.position.y ||
    newPos.z !== p.mesh.position.z ||
    newRotation !== p.mesh.rotation.y
  ) {
    // Rotate the player
    p.rotate(newRotation);

    // Attempt to move the player to the new position
    const currentPosition = p.mesh.position.clone();
    p.move(newPos.x, newPos.y, newPos.z);

    // Check for collisions after attempting to move
    handleCollisions(p, maze);

    // Check if the player's position has changed after collision handling
    if (
      currentPosition.x !== p.mesh.position.x ||
      currentPosition.y !== p.mesh.position.y ||
      currentPosition.z !== p.mesh.position.z
    ) {
      // Player successfully moved, send updated position to server
      const newPosition = {
        id: p.id,
        position: p.mesh.position,
        rotation: p.mesh.rotation.y,
      };
      sendPosition(newPosition);
    }
  }
  if (!isPlayerOnGround(p, scene)) {
    p.mesh.position.y -= GRAVITY_ACCELERATION;

    // Check for collisions with vertical walls and prevent climbing
    handleVerticalCollisions(p, maze);
  }
}

function handleVerticalCollisions(player, maze) {
  const playerBoundingBox = new THREE.Box3().setFromObject(player.mesh);
  const mazeBoundingBoxes = [];

  maze.traverse((child) => {
    if (child.isMesh) {
      const childBoundingBox = new THREE.Box3().setFromObject(child);
      mazeBoundingBoxes.push(childBoundingBox);
    }
  });

  // Check for intersections between player and maze walls
  for (const mazeBoundingBox of mazeBoundingBoxes) {
    // Ensure mazeBoundingBox is defined and not null
    if (mazeBoundingBox && mazeBoundingBox.min && mazeBoundingBox.max) {
      if (playerBoundingBox.intersectsBox(mazeBoundingBox)) {
        // Calculate the angle between the player's up direction and the normal of the collided wall
        const playerUpDirection = new THREE.Vector3(0, 1, 0);
        const wallNormal = mazeBoundingBox.getNormal(new THREE.Vector3());
        const angle = playerUpDirection.angleTo(wallNormal);

        // If the angle is greater than the maximum climb angle, prevent climbing
        if (angle > MAX_CLIMB_ANGLE) {
          // Move the player back to the ground level
          p.mesh.position.y = Math.max(
            p.mesh.position.y,
            mazeBoundingBox.max.y +
              playerBoundingBox.getSize(new THREE.Vector3()).y / 2
          );
        }
      }
    }
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

function isPlayerOnGround(player, scene) {
  // Create a raycaster pointing downward from the player's position
  const raycaster = new THREE.Raycaster(player.mesh.position.clone(), new THREE.Vector3(0, -1, 0), 0, player.geometry.boundingSphere.radius);

  // Perform the raycast
  const intersects = raycaster.intersectObjects(scene.children, true);

  // If there are no intersections, the player is in the air
  return intersects.length > 0;
}

function colliding() {
  const box3 = new THREE.Box3().setFromObject(maze.raycast());
}

// Event listeners para el control de ratón
window.addEventListener("mousedown", mouseEvents.onMouseDown, true);
window.addEventListener("mouseup", mouseEvents.onMouseUp, false);
window.addEventListener("mousemove", mouseEvents.onMouseMove, true);

// Control de teclado para mover al jugador
window.addEventListener("keydown", keyEvents.onKeyDown, false);
window.addEventListener("keyup", keyEvents.onKeyUp, false);

document.getElementById("canvas").appendChild(renderer.domElement);

export { animate, updateEnemies, deleteEnemy, addEnemy };
