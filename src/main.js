// Crear la escena

const scene = new THREE.Scene();

console.log(scene);

function initRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

function initPlayer() {
  // Crear un cubo para representar al jugador
  const geometry = new THREE.BoxGeometry();
  const material = [
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Derecha (frente)
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Izquierda (frente)
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Arriba (frente)
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Abajo (frente)
    new THREE.MeshBasicMaterial({ color: 0x000000 }), // Frente (mirando hacia aquí)
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Atrás
  ];
  return new THREE.Mesh(geometry, material);
}
function initGround() {
  // Crear un suelo
  const groundGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(groundGeometry, groundMaterial);
}

// Define la estructura del laberinto (0: pasillo, 1: pared)
const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
];

console.log(maze);

// Tamaño de cada celda del laberinto
const cellSize = 2;

// Función para inicializar el laberinto
function initMaze() {
  const mazeGroup = new THREE.Group();

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        const wallGeometry = new THREE.BoxGeometry(
          cellSize,
          cellSize,
          cellSize
        );
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(
          (j - maze.length / 2) * cellSize,
          0,
          (i - maze.length / 2) * cellSize
        );
        mazeGroup.add(wall);
      }
    }
  }

  return mazeGroup;
}

// Inicializa y agrega el laberinto a la escena
const mazeObject = initMaze();
scene.add(mazeObject);


// Crear el renderizador
const renderer = initRenderer();


const player = initPlayer();
player.position.set(-95, 0.5, -95);
scene.add(player);

// Crear la cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, -10);

// Crear un suelo
const ground = initGround();
ground.rotation.x = Math.PI / -2;
scene.add(ground);

// Control de teclado para mover al jugador
const moveSpeed = 0.1;
const keys = {
  W: false,
  A: false,
  S: false,
  D: false,
};

// Control de ratón para rotar la cámara alrededor del jugador
const mouseDown = false;
const lastMouseX = null;
const cameraRotation = 0;
const playerRotation = 0;

function onMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
}

function onMouseUp(event) {
  mouseDown = false;
  lastMouseX = null;

  playerRotation = cameraRotation;
}

function onMouseMove(event) {
  if (!mouseDown) return;

  const deltaX = event.clientX - lastMouseX;
  cameraRotation -= deltaX * 0.001;
  lastMouseX = event.clientX;
}



function onKeyDown(event) {
  switch (event.key.toUpperCase()) {
    case "W":
      keys.W = true;
      break;
    case "A":
      keys.A = true;
      break;
    case "S":
      keys.S = true;
      break;
    case "D":
      keys.D = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.key.toUpperCase()) {
    case "W":
      keys.W = false;
      break;
    case "A":
      keys.A = false;
      break;
    case "S":
      keys.S = false;
      break;
    case "D":
      keys.D = false;
      break;
  }
}

function updatePlayer() {
  // Mover al jugador
  movePlayer();

  // Actualizar la rotación del jugador para que coincida con la rotación de la cámara
  //const deltaRotation = -camera.rotation.y - player.rotation.y;
  //player.rotation.y += deltaRotation * 0.1;
  player.rotation.y = playerRotation;
}

// Actualizar la posición de la cámara para seguir al jugador
function updateCamera() {
  camera.position.x = player.position.x - 10 * Math.sin(cameraRotation);
  camera.position.z = player.position.z - 10 * Math.cos(cameraRotation);
  camera.lookAt(player.position);
}

// Animar la escena
function animate() {
  requestAnimationFrame(animate);

  updatePlayer();

  updateCamera();

  // Renderizar la escena
  renderer.render(scene, camera);
}



function movePlayer() {
  // Calculamos las posiciones candidatas del jugador
  const nextX = player.position.x;
  const nextZ = player.position.z;

  if (keys.W) {
    nextX += moveSpeed * Math.sin(player.rotation.y);
    nextZ += moveSpeed * Math.cos(player.rotation.y);
  }
  if (keys.A) {
    nextX += moveSpeed * Math.cos(player.rotation.y);
    nextZ -= moveSpeed * Math.sin(player.rotation.y);
  }
  if (keys.S) {
    nextX -= moveSpeed * Math.sin(player.rotation.y);
    nextZ -= moveSpeed * Math.cos(player.rotation.y);
  }
  if (keys.D) {
    nextX -= moveSpeed * Math.cos(player.rotation.y);
    nextZ += moveSpeed * Math.sin(player.rotation.y);
  }

  player.position.x = nextX;
  player.position.z = nextZ;

  /* Verificamos si el jugador está dentro del suelo
  if (isPlayerOnGround(nextX, nextZ)) {
    // Movemos al jugador
    player.position.x = nextX;
    player.position.z = nextZ;
  }*/
}

function isPlayerOnGround(x, z) {
  // Verificamos si el jugador está dentro de los límites del suelo
  return x >= -9.5 && x <= 9.5 && z >= -9.5 && z <= 9.5;
}


// Event listeners para el control de ratón
window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);
window.addEventListener("mousemove", onMouseMove, false);

// Control de teclado para mover al jugador
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

// Llamar a la función de animación
animate();

document.body.appendChild(renderer.domElement);