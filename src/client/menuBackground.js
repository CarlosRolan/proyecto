import * as THREE from "../../three/build/three.module.js";
import { menuCamera, moveCameraAround } from "./camera.js";
import { maze } from "./maze.js";
import { ground } from "./ground.js";
import {
 cameraRotation,
} from "./controls.js";
import { renderer } from "./renderer.js";

const scene = new THREE.Scene();
scene.add(maze, ground);

// Main render method
function animate() {
 requestAnimationFrame(animate);
 moveCameraAround();
 renderer.render(scene, menuCamera);
}


document.getElementById("background").appendChild(renderer.domElement);

animate();