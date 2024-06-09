import * as THREE from "../../three/build/three.module.js";
import { enemies, p } from "./player.js";
import { playerCamera } from "./camera.js";
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
import { listener, mazeCollisionSound, walkSound, winningSound } from "./audioLoader.js";


const cellSize = maze.cellSize;
const halfCellSize = cellSize / 2;

const playerBoundingBox = new THREE.Box3();

const mazeData = maze.mazeData;
const mazeBoundingBoxes = maze.mazeBoundingBoxes;

const scene = new THREE.Scene();

const [starX, starY] = findValidPosition();
star.position.set(starX * cellSize - mazeData[0].length / 2 * cellSize + halfCellSize, 1, starY * cellSize - mazeData.length / 2 * cellSize + halfCellSize);
// Position the player at the entrance
p.mesh.position.set(1 * cellSize - mazeData[0].length / 2 * cellSize + halfCellSize, 1, 0 * cellSize - mazeData.length / 2 * cellSize + halfCellSize);

playerCamera.add(listener);

scene.add(maze, p.mesh, ground, star);

// Main render method
function animate() {
  requestAnimationFrame(animate);
  updatePlayer();
  updateCamera();
  rotateStar();
  renderer.render(scene, playerCamera);
}

// ======== UPDATE METHODS =====/
function updateCamera() {
  playerCamera.position.set(
    p.mesh.position.x - 5 * Math.sin(cameraRotation),
    playerCamera.position.y,
    p.mesh.position.z - 5 * Math.cos(cameraRotation)
  );
  playerCamera.lookAt(p.mesh.position);
}

function updatePlayer() {
  const currentPosition = p.mesh.position.clone();
  const newPos = calculateNewPos(p.mesh.position, p.speed);
  const newRotation = getRotation();

  if (!currentPosition.equals(newPos)) {

    p.rotate(newRotation);
    p.move(newPos.x, newPos.y, newPos.z);

    handleMazeCollisions(p);
    handleSimplePlayerCollisions(p);
    handlePlayerStarCollision(p);

    // Play walking sound
    if (!walkSound.isPlaying) {
      walkSound.play();
    }

    sendPosition({ id: p.id, position: p.mesh.position, rotation: p.mesh.rotation.y });

    document.getElementById("posLb").innerHTML = JSON.stringify(p.getCurrentPos());

  } else {

    // Play walking sound
    if (walkSound.isPlaying) {
      walkSound.stop();
    }
  }


  /*if (p.mesh.position.y > 0.5 && !p.climbing) {
    p.mesh.position.y -= 0.1;
  }*/
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

function handleMazeCollisions(player) {
  playerBoundingBox.setFromObject(player.mesh);
  for (const mazeBoundingBox of mazeBoundingBoxes) {
    if (playerBoundingBox.intersectsBox(mazeBoundingBox)) {

      if (!mazeCollisionSound.isPlaying) {
        mazeCollisionSound.play();
      }
      player.speed = 0.02;
      return;
    }
  }
  player.speed = 0.1;
  if (mazeCollisionSound.isPlaying) {
    mazeCollisionSound.stop();
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

function handlePlayerStarCollision(player) {
  const playerBoundingBox = new THREE.Box3().setFromObject(player.mesh);
  star.geometry.computeBoundingBox();
  const startBoundingBox = new THREE.Box3().setFromObject(star);

  if (playerBoundingBox.intersectsBox(startBoundingBox)) {
    win(player);
    winningSound.play();
    scene.remove(maze, player, ground);
    return;
  }
}
// Function to find a valid position in the maze
function findValidPosition() {
  const height = mazeData.length;
  const width = mazeData[0].length;
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  if (mazeData[centerY][centerX] === 0) {
    return [centerX, centerY];
  }

  // Find the nearest open cell to the center
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  for (let radius = 1; radius < Math.max(width, height); radius++) {
    for (let [dx, dy] of directions) {
      let nx = centerX + dx * radius;
      let ny = centerY + dy * radius;
      if (nx >= 0 && ny >= 0 && nx < width && ny < height && mazeData[ny][nx] === 0) {
        return [nx, ny];
      }
    }
  }
  return [centerX, centerY]; // Fallback
}

window.addEventListener("scroll", function (e) {
  console.log("Scrolll");
  playerCamera.position.y++; // Adjust the y-coordinate to set the camera above the map
  e.preventDefault();
}, false);
// Add event listener for keydown event
window.addEventListener('keydown', (e) => {
  mouseEvents.onSpacePress(e, p);
}, false);
window.addEventListener("mousedown", mouseEvents.onMouseDown, true);
window.addEventListener("mouseup", mouseEvents.onMouseUp, false);
window.addEventListener("mousemove", mouseEvents.onMouseMove, true);
window.addEventListener("keydown", keyEvents.onKeyDown, false);
window.addEventListener("keyup", keyEvents.onKeyUp, false);

document.getElementById("canvas").appendChild(renderer.domElement);

export { animate, updateEnemies, deleteEnemy, addEnemy };

/*
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
*/