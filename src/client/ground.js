import * as THREE from "../../three/build/three.module.js";

// Initialize the ground directly
const groundGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);

// Load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('res/img/texture_ground.png'); 

// Set the repeat property of the texture
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
const repeatX = 70; // Number of times to repeat the texture horizontally
const repeatY = 70; // Number of times to repeat the texture vertically
texture.repeat.set(repeatX, repeatY);

// Create a material using the texture
const groundMaterial = new THREE.MeshBasicMaterial({ map: texture });

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / -2;

// Calculate random position within the boundaries of the ground
const minX = -groundGeometry.parameters.width / 2;
const maxX = groundGeometry.parameters.width / 2;
const minZ = -groundGeometry.parameters.height / 2;
const maxZ = groundGeometry.parameters.height / 2;

const randomX = Math.random() * (maxX - minX) + minX;
const randomZ = Math.random() * (maxZ - minZ) + minZ;

export { ground };
