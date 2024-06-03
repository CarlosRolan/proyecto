import * as THREE from "../../three/build/three.module.js";
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

const GRAVITY_ACCELERATION = 9.8;
const scene = new THREE.Scene();
scene.add(maze, p.mesh, ground, spotLight, spotLight.target);

const playerBoundingBox = new THREE.Box3();
const mazeBoundingBoxes = [];

maze.traverse((child) => {
  if (child.isMesh) {
    mazeBoundingBoxes.push(new THREE.Box3().setFromObject(child));
  }
});

function handleCollisions(player) {
  playerBoundingBox.setFromObject(player.mesh);
  for (const mazeBoundingBox of mazeBoundingBoxes) {
    if (playerBoundingBox.intersectsBox(mazeBoundingBox)) {
      const overlap = {
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

      playerBoundingBox.setFromObject(player.mesh);
      break;
    }
  }
}

function updateCamera() {
  camera.position.set(
    p.mesh.position.x - 10 * Math.sin(cameraRotation),
    camera.position.y,
    p.mesh.position.z - 10 * Math.cos(cameraRotation)
  );
  camera.lookAt(p.mesh.position);
}

function updatePlayer() {
  const newPos = playerActions.calculateNewPos(p.mesh.position);
  const newRotation = playerActions.getRotation();

  if (newPos.x !== p.mesh.position.x || newPos.y !== p.mesh.position.y || newPos.z !== p.mesh.position.z || newRotation !== p.mesh.rotation.y) {
    p.rotate(newRotation);
    const currentPosition = p.mesh.position.clone();
    p.move(newPos.x, newPos.y, newPos.z);

    handleCollisions(p);

    if (!currentPosition.equals(p.mesh.position)) {
      sendPosition({ id: p.id, position: p.mesh.position, rotation: p.mesh.rotation.y });
    }

    document.getElementById("posLb").innerHTML = JSON.stringify(p.getCurrentPos());
  }

  if (p.mesh.position.y > 0.5 && !p.climbing) {
    p.mesh.position.y -= 0.1;
  }
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

function updateEnemies(enemies) {
  enemies.forEach(enemy => scene.add(enemy.mesh));
}

function addEnemy(enemy) {
  enemies.add(enemy);
}

function deleteEnemy(enemyId) {
  enemies.forEach(e => {
    if (e.id === enemyId) {
      enemies.delete(e);
      scene.remove(scene.getObjectByName(enemyId));
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  updatePlayer();
  updateCamera();
  renderer.render(scene, camera);
}

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

window.addEventListener("mousedown", mouseEvents.onMouseDown, true);
window.addEventListener("mouseup", mouseEvents.onMouseUp, false);
window.addEventListener("mousemove", mouseEvents.onMouseMove, true);
window.addEventListener("keydown", keyEvents.onKeyDown, false);
window.addEventListener("keyup", keyEvents.onKeyUp, false);

document.getElementById("canvas").appendChild(renderer.domElement);

export { animate, updateEnemies, deleteEnemy, addEnemy };
