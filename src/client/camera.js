import * as THREE from "../../three/build/three.module.js";

// Define camera parameters
const FOV = 75;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const NEAR_PLANE = 0.1;
const FAR_PLANE = 1000;
const CAMERA_POSITION = new THREE.Vector3(0, 5, -10);

// Create the camera
const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE);
camera.position.copy(CAMERA_POSITION);

export { camera };
