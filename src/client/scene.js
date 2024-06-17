import * as THREE from "../../three/build/three.module.js";
import { Player, enemies, p } from "./player.js";
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


const { boundries } = ground;
const { minX, maxX, minZ, maxZ } = boundries;

const { mazeData, cellSize } = maze;
const halfCellSize = cellSize / 2;

const scene = new THREE.Scene();

let spectacting = false;

const [starX, starY] = findValidPosition(mazeData);
// Position the start at the middle
star.position.set(starX * cellSize - mazeData[0].length / 2 * cellSize + halfCellSize, 1, starY * cellSize - mazeData.length / 2 * cellSize + halfCellSize);
// Position the player at the entrance
p.mesh.position.set(1 * cellSize - mazeData[0].length / 2 * cellSize + halfCellSize, 1, 0 * cellSize - mazeData.length / 2 * cellSize + halfCellSize);

playerCamera.add(listener);

scene.add(maze, p.mesh, ground, star);

function spectate() {
  scene.remove(p);
  playerCamera.lookAt(star);
  playerCamera.position.set(50, 100, 50);
  spectacting = true;
}


// Main render method
function animate() {
  requestAnimationFrame(animate);
  if (!spectacting) {
    updatePlayer();
    updateCamera();
  } else {
    playerCamera.lookAt(star);
  }
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

  let newPos = calculateNewPos(p.mesh.position, p.speed);
  const newRotation = getRotation();

  // Boundary check to ensure the player stays within the ground limits
  newPos = checkPlayerBoundary(newPos);

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

function addEnemy(enemyId) {
  enemies.forEach(e => {
    if (e.id == p.id) {
      console.log("THAT IS YOU");
      return;
    }
    if (e.id === enemyId) {
      console.log("Enemy already exists");
      return;
    }
  });
  const newEnemy = new Player(enemyId);
  enemies.add(newEnemy);
  scene.add(newEnemy.mesh); // Add the enemy to the scene
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
function checkPlayerBoundary(position) {
  if (position.x < minX) {
    position.x = minX;
  } else if (position.x > maxX) {
    position.x = maxX;
  }

  if (position.z < minZ) {
    position.z = minZ;
  } else if (position.z > maxZ) {
    position.z = maxZ;
  }

  return position;
}

function handleMazeCollisions(player) {
  let bushCollisionDetected = false;
  const playerBoundingBox = new THREE.Box3().setFromObject(player.mesh);
  let correctionVector = new THREE.Vector3();

  for (const mazeBoundingBox of maze.mazeBoundingBoxes) {
    if (playerBoundingBox.intersectsBox(mazeBoundingBox)) {
      switch (mazeBoundingBox.type) {
        case "bush":
          bushCollisionDetected = true;
          if (!mazeCollisionSound.isPlaying) {
            mazeCollisionSound.play();
          }
          player.speed = 0.02;
          break;
        case "wall":
          const overlap = {
            x: Math.min(playerBoundingBox.max.x - mazeBoundingBox.min.x, mazeBoundingBox.max.x - playerBoundingBox.min.x),
            y: Math.min(playerBoundingBox.max.y - mazeBoundingBox.min.y, mazeBoundingBox.max.y - playerBoundingBox.min.y),
            z: Math.min(playerBoundingBox.max.z - mazeBoundingBox.min.z, mazeBoundingBox.max.z - playerBoundingBox.min.z),
          };

          if (overlap.x < overlap.y && overlap.x < overlap.z) {
            correctionVector.x += playerBoundingBox.min.x < mazeBoundingBox.min.x ? -overlap.x : overlap.x;
          } else if (overlap.y < overlap.x && overlap.y < overlap.z) {
            correctionVector.y += playerBoundingBox.min.y < mazeBoundingBox.min.y ? -overlap.y : overlap.y;
          } else {
            correctionVector.z += playerBoundingBox.min.z < mazeBoundingBox.min.z ? -overlap.z : overlap.z;
          }
          break;
        default:
          break;
      }
    }
  }

  player.mesh.position.add(correctionVector);

  if (!bushCollisionDetected) {
    player.speed = 0.1;
    if (mazeCollisionSound.isPlaying) {
      mazeCollisionSound.stop();
    }
  }
}

function handleSimplePlayerCollisions(player) {
  const playerBoundingBox = new THREE.Box3();
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

window.addEventListener("mousedown", mouseEvents.onMouseDown, true);
window.addEventListener("mouseup", mouseEvents.onMouseUp, false);
window.addEventListener("mousemove", mouseEvents.onMouseMove, true);
window.addEventListener("keydown", keyEvents.onKeyDown, false);
window.addEventListener("keyup", keyEvents.onKeyUp, false);

document.getElementById("canvas").appendChild(renderer.domElement);

export { animate, updateEnemies, deleteEnemy, addEnemy, spectate };