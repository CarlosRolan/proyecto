import * as THREE from "../../three/build/three.module.js";
import { enemies, p } from "./player.js";
import { spotLight } from "./light.js";
import { camera } from "./camera.js";
import { maze } from "./maze.js";
import { ground, star, rotateStar } from "./ground.js";
import {
  mouseEvents,
  keyEvents,
  playerActions,
  cameraRotation,
} from "./controls.js";
import { renderer } from "./renderer.js";
import { sendPosition, win } from "./client.js";

const GRAVITY_ACCELERATION = 9.8;
const scene = new THREE.Scene();
scene.add(maze, ground, p);


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



animate();

export { animate };
