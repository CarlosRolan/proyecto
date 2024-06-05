import * as THREE from "../../three/build/three.module.js";

// Initialize the ground directly
const groundGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
const groundMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / -2;

// Calculate random position within the boundaries of the ground
const minX = -groundGeometry.parameters.width / 2;
const maxX = groundGeometry.parameters.width / 2;
const minZ = -groundGeometry.parameters.height / 2;
const maxZ = groundGeometry.parameters.height / 2;

const randomX = Math.random() * (maxX - minX) + minX;
const randomZ = Math.random() * (maxZ - minZ) + minZ;

// Create a star shape
const starShape = new THREE.Shape();
starShape.moveTo(0, 10);
for (let i = 0; i < 5; i++) {
  starShape.lineTo(Math.cos((Math.PI / 5) * 2 * i) * 5, Math.sin((Math.PI / 5) * 2 * i) * 5);
  starShape.lineTo(Math.cos((Math.PI / 5) * (2 * i + 1)) * 3, Math.sin((Math.PI / 5) * (2 * i + 1)) * 3);
}
starShape.lineTo(0, 10);

// Extrude the star shape to create geometry
const extrudeSettings = {
  steps: 1,
  depth: 1,
  bevelEnabled: false,
};
const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);

// Create star mesh
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const star = new THREE.Mesh(starGeometry, starMaterial);
//star.position.set(randomX, 1, randomZ); // Adjust the position to be above the ground
star.position.set(-90, 1, -90); // Adjust the position to be above the ground
star.scale.set(0.5, 0.5, 0.5); // Adjust the scale to make the star smaller

// Make the star rotate and bounce
let bouncingUp = true;
function rotateStar() {
  star.rotation.y += 0.01; // Adjust rotation speed as needed

  // Bounce the star
  const bounceAmount = 0.02; // Adjust the amount of bounce
  if (bouncingUp) {
    star.position.y += bounceAmount;
    if (star.position.y >= 3) {
      bouncingUp = false;
    }
  } else {
    star.position.y -= bounceAmount;
    if (star.position.y <= 1.5) { // Adjust the height to keep the star above the ground
      bouncingUp = true;
    }
  }
}

export { ground, star, rotateStar };
