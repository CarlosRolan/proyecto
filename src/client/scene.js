import * as THREE from "../../three/build/three.module.js";
import { enemies, p } from "./player.js";
import { camera } from "./camera.js";
import { maze } from "./maze.js";
import { ground } from "./ground.js";
import { star, rotateStar } from "./start.js";
import {
  mouseEvents,
  keyEvents,
  calculateNewPos, getRotation,
  cameraRotation,
} from "./controls.js";
import { renderer } from "./renderer.js";
import { sendPosition, win } from "./client.js";

const GRAVITY_ACCELERATION = 9.8;
const scene = new THREE.Scene();
scene.add(maze, p.mesh, ground, star);

const playerBoundingBox = new THREE.Box3();
const mazeBoundingBoxes = [];

maze.traverse((child) => {
  if (child.isMesh) {
    mazeBoundingBoxes.push(new THREE.Box3().setFromObject(child));
  }
});

// Main render method
function animate() {
  requestAnimationFrame(animate);
  updatePlayer();
  updateCamera();
  rotateStar();
  renderer.render(scene, camera);
}

// ======== UPDATE METHODS =====/
function updateCamera() {
  camera.position.set(
    p.mesh.position.x - 10 * Math.sin(cameraRotation),
    camera.position.y,
    p.mesh.position.z - 10 * Math.cos(cameraRotation)
  );
  camera.lookAt(p.mesh.position);
}

function updatePlayer() {
  const newPos = calculateNewPos(p.mesh.position, p.speed);
  const newRotation = getRotation();

  if (newPos.x !== p.mesh.position.x || newPos.y !== p.mesh.position.y || newPos.z !== p.mesh.position.z || newRotation !== p.mesh.rotation.y) {
    p.rotate(newRotation);
    const currentPosition = p.mesh.position.clone();
    p.move(newPos.x, newPos.y, newPos.z);

    handleCollisions(p);
    handleSimplePlayerCollisions(p);
    handlePlayerStarCollision(p);

    if (!currentPosition.equals(p.mesh.position)) {
      sendPosition({ id: p.id, position: p.mesh.position, rotation: p.mesh.rotation.y });
    }

    document.getElementById("posLb").innerHTML = JSON.stringify(p.getCurrentPos());
  }

  if (p.mesh.position.y > 0.5 && !p.climbing) {
    p.mesh.position.y -= 0.1;
  }
}

function updateEnemies(enemies) {
  enemies.forEach(enemy => scene.add(enemy.mesh));
}

function addEnemy(enemy) {
  enemies.add(enemy);
  scene.add(enemy.mesh); // Add the enemy to the scene
}

function deleteEnemy(enemyId) {
  enemies.forEach(e => {
    if (e.id === enemyId) {
      enemies.delete(e);
      scene.remove(e.mesh); // Remove the enemy from the scene
    }
  });
}

//======================[COLLISIONS]=======================/
function isPlayerOnGround(player, scene) {
  const raycaster = new THREE.Raycaster(
    player.mesh.position.clone(),
    new THREE.Vector3(0, -1, 0),
    0,
    player.geometry.boundingSphere.radius
  );
  const intersects = raycaster.intersectObjects(scene.children, true);
  return intersects.length > 0;
}

function handleVerticalCollisions(player) {
  playerBoundingBox.setFromObject(player.mesh);
  for (const mazeBoundingBox of mazeBoundingBoxes) {
    if (playerBoundingBox.intersectsBox(mazeBoundingBox)) {
      player.climbing = true;
      const playerUpDirection = new THREE.Vector3(0, 1, 0);
      const wallNormal = mazeBoundingBox.getNormal(new THREE.Vector3());
      const angle = playerUpDirection.angleTo(wallNormal);
      if (angle > MAX_CLIMB_ANGLE) {
        p.mesh.position.y = Math.max(p.mesh.position.y, mazeBoundingBox.max.y + playerBoundingBox.getSize(new THREE.Vector3()).y / 2);
      }
    } else {
      player.climbing = false;
    }
  }
}

function handleCollisions(player) {
  playerBoundingBox.setFromObject(player.mesh);
  for (const mazeBoundingBox of mazeBoundingBoxes) {
    if (playerBoundingBox.intersectsBox(mazeBoundingBox)) {
      /*const overlap = {
        x: Math.min(playerBoundingBox.max.x - mazeBoundingBox.min.x, mazeBoundingBox.max.x - playerBoundingBox.min.x),
        y: Math.min(playerBoundingBox.max.y - mazeBoundingBox.min.y, mazeBoundingBox.max.y - playerBoundingBox.min.y),
        z: Math.min(playerBoundingBox.max.z - mazeBoundingBox.min.z, mazeBoundingBox.max.z - playerBoundingBox.min.z),
      };

      if (overlap.x < overlap.y && overlap.x < overlap.z) {
        player.mesh.position.x += playerBoundingBox.min.x < mazeBoundingBox.min.x ? -overlap.x : overlap.x;
      } else if (overlap.y < overlap.x && overlap.y < overlap.z) {
        player.mesh.position.y += playerBoundingBox.min.y < mazeBoundingBox.min.y ? -overlap.y : overlap.y;
      } else {
        player.mesh.position.z += playerBoundingBox.min.z < mazeBoundingBox.min.z ? -overlap.z : overlap.z;
      }

      playerBoundingBox.setFromObject(player.mesh);*/
      player.speed = 0.05;
      break;
    } else {
      player.speed = 0.1;
    }
  }
}

function handleSimplePlayerCollisions(player) {
  playerBoundingBox.setFromObject(player.mesh);
  enemies.forEach(enemy => {
    const enemyBoundingBox = new THREE.Box3().setFromObject(enemy.mesh);
    if (playerBoundingBox.intersectsBox(enemyBoundingBox)) {
      const overlap = {
        x: Math.min(playerBoundingBox.max.x - enemyBoundingBox.min.x, enemyBoundingBox.max.x - playerBoundingBox.min.x),
        y: Math.min(playerBoundingBox.max.y - enemyBoundingBox.min.y, enemyBoundingBox.max.y - playerBoundingBox.min.y),
        z: Math.min(playerBoundingBox.max.z - enemyBoundingBox.min.z, enemyBoundingBox.max.z - playerBoundingBox.min.z),
      };

      if (overlap.x < overlap.y && overlap.x < overlap.z) {
        player.mesh.position.x += playerBoundingBox.min.x < enemyBoundingBox.min.x ? -overlap.x : overlap.x;
      } else if (overlap.y < overlap.x && overlap.y < overlap.z) {
        player.mesh.position.y += playerBoundingBox.min.y < enemyBoundingBox.min.y ? -overlap.y : overlap.y;
      } else {
        player.mesh.position.z += playerBoundingBox.min.z < enemyBoundingBox.min.z ? -overlap.z : overlap.z;
      }

      playerBoundingBox.setFromObject(player.mesh);
      return
    }
  });
}

function handlePlayerCollisions(player, newPos) {
  playerBoundingBox.setFromObject(player.mesh);
  enemies.forEach(enemy => {
    const enemyBoundingBox = new THREE.Box3().setFromObject(enemy.mesh);
    if (playerBoundingBox.intersectsBox(enemyBoundingBox)) {
      const overlap = {
        x: Math.min(playerBoundingBox.max.x - enemyBoundingBox.min.x, enemyBoundingBox.max.x - playerBoundingBox.min.x),
        y: Math.min(playerBoundingBox.max.y - enemyBoundingBox.min.y, enemyBoundingBox.max.y - playerBoundingBox.min.y),
        z: Math.min(playerBoundingBox.max.z - enemyBoundingBox.min.z, enemyBoundingBox.max.z - playerBoundingBox.min.z),
      };

      const playerVelocity = new THREE.Vector3(
        newPos.x - player.mesh.position.x,
        newPos.y - player.mesh.position.y,
        newPos.z - player.mesh.position.z
      ).multiplyScalar(0.5); // Halve the player's speed

      const enemyVelocity = new THREE.Vector3(
        enemy.mesh.position.x - newPos.x,
        enemy.mesh.position.y - newPos.y,
        enemy.mesh.position.z - newPos.z
      ).multiplyScalar(0.5); // Halve the enemy's speed

      if (overlap.x < overlap.y && overlap.x < overlap.z) {
        if (player.mesh.position.x < enemy.mesh.position.x) {
          player.mesh.position.x -= overlap.x;
          enemy.mesh.position.x += overlap.x;
        } else {
          player.mesh.position.x += overlap.x;
          enemy.mesh.position.x -= overlap.x;
        }
        playerVelocity.x = -playerVelocity.x;
        enemyVelocity.x = -enemyVelocity.x;
      } else if (overlap.y < overlap.x && overlap.y < overlap.z) {
        if (player.mesh.position.y < enemy.mesh.position.y) {
          player.mesh.position.y -= overlap.y;
          enemy.mesh.position.y += overlap.y;
        } else {
          player.mesh.position.y += overlap.y;
          enemy.mesh.position.y -= overlap.y;
        }
        playerVelocity.y = -playerVelocity.y;
        enemyVelocity.y = -enemyVelocity.y;
      } else {
        if (player.mesh.position.z < enemy.mesh.position.z) {
          player.mesh.position.z -= overlap.z;
          enemy.mesh.position.z += overlap.z;
        } else {
          player.mesh.position.z += overlap.z;
          enemy.mesh.position.z -= overlap.z;
        }
        playerVelocity.z = -playerVelocity.z;
        enemyVelocity.z = -enemyVelocity.z;
      }

      // Ensure velocities are not summed in the same direction and cancel out in opposite directions
      if (playerVelocity.dot(enemyVelocity) > 0) {
        playerVelocity.multiplyScalar(0.5);
        enemyVelocity.multiplyScalar(0.5);
      } else {
        playerVelocity.set(0, 0, 0);
        enemyVelocity.set(0, 0, 0);
      }

      player.mesh.position.add(playerVelocity);
      enemy.mesh.position.add(enemyVelocity);

      playerBoundingBox.setFromObject(player.mesh);
      enemyBoundingBox.setFromObject(enemy.mesh);
    }
  });
}

function handlePlayerStarCollision(player) {
  const playerBoundingBox = new THREE.Box3().setFromObject(player.mesh);
  star.geometry.computeBoundingBox();
  const startBoundingBox = new THREE.Box3().setFromObject(star);
  const starPosition = star.position.clone();
  const playerPosition = player.mesh.position.clone();

  if (playerBoundingBox.intersectsBox(startBoundingBox)) {
    win(player);
  }
}




window.addEventListener("mousedown", mouseEvents.onMouseDown, true);
window.addEventListener("mouseup", mouseEvents.onMouseUp, false);
window.addEventListener("mousemove", mouseEvents.onMouseMove, true);
window.addEventListener("keydown", keyEvents.onKeyDown, false);
window.addEventListener("keyup", keyEvents.onKeyUp, false);

document.getElementById("canvas").appendChild(renderer.domElement);

export { animate, updateEnemies, deleteEnemy, addEnemy };
