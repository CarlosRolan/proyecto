"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

// Crear la escena
var scene = new THREE.Scene();
console.log(scene);

function initRenderer() {
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

function initPlayer() {
  // Crear un cubo para representar al jugador
  var geometry = new THREE.BoxGeometry();
  var material = [new THREE.MeshBasicMaterial({
    color: 0x00ff00
  }), // Derecha (frente)
  new THREE.MeshBasicMaterial({
    color: 0xff0000
  }), // Izquierda (frente)
  new THREE.MeshBasicMaterial({
    color: 0x0000ff
  }), // Arriba (frente)
  new THREE.MeshBasicMaterial({
    color: 0xffff00
  }), // Abajo (frente)
  new THREE.MeshBasicMaterial({
    color: 0x000000
  }), // Frente (mirando hacia aquí)
  new THREE.MeshBasicMaterial({
    color: 0xffffff
  }) // Atrás
  ];
  return new THREE.Mesh(geometry, material);
}

function initGround() {
  // Crear un suelo
  var groundGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
  var groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide
  });
  return new THREE.Mesh(groundGeometry, groundMaterial);
} // Define la estructura del laberinto (0: pasillo, 1: pared)


var maze = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1]];
console.log(maze); // Tamaño de cada celda del laberinto

var cellSize = 2; // Función para inicializar el laberinto

function initMaze() {
  var mazeGroup = new THREE.Group();

  for (var i = 0; i < maze.length; i++) {
    for (var j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        var wallGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
        var wallMaterial = new THREE.MeshBasicMaterial({
          color: 0x555555
        });
        var wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set((j - maze.length / 2) * cellSize, 0, (i - maze.length / 2) * cellSize);
        mazeGroup.add(wall);
      }
    }
  }

  return mazeGroup;
} // Inicializa y agrega el laberinto a la escena


var mazeObject = initMaze();
scene.add(mazeObject); // Crear el renderizador

var renderer = initRenderer();
var player = initPlayer();
player.position.set(-95, 0.5, -95);
scene.add(player); // Crear la cámara

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, -10); // Crear un suelo

var ground = initGround();
ground.rotation.x = Math.PI / -2;
scene.add(ground); // Control de teclado para mover al jugador

var moveSpeed = 0.1;
var keys = {
  W: false,
  A: false,
  S: false,
  D: false
}; // Control de ratón para rotar la cámara alrededor del jugador

var mouseDown = false;
var lastMouseX = null;
var cameraRotation = 0;
var playerRotation = 0;

function onMouseDown(event) {
  mouseDown = (_readOnlyError("mouseDown"), true);
  lastMouseX = (_readOnlyError("lastMouseX"), event.clientX);
}

function onMouseUp(event) {
  mouseDown = (_readOnlyError("mouseDown"), false);
  lastMouseX = (_readOnlyError("lastMouseX"), null);
  playerRotation = (_readOnlyError("playerRotation"), cameraRotation);
}

function onMouseMove(event) {
  if (!mouseDown) return;
  var deltaX = event.clientX - lastMouseX;
  cameraRotation -= (_readOnlyError("cameraRotation"), deltaX * 0.001);
  lastMouseX = (_readOnlyError("lastMouseX"), event.clientX);
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
  movePlayer(); // Actualizar la rotación del jugador para que coincida con la rotación de la cámara
  //const deltaRotation = -camera.rotation.y - player.rotation.y;
  //player.rotation.y += deltaRotation * 0.1;

  player.rotation.y = playerRotation;
} // Actualizar la posición de la cámara para seguir al jugador


function updateCamera() {
  camera.position.x = player.position.x - 10 * Math.sin(cameraRotation);
  camera.position.z = player.position.z - 10 * Math.cos(cameraRotation);
  camera.lookAt(player.position);
} // Animar la escena


function animate() {
  requestAnimationFrame(animate);
  updatePlayer();
  updateCamera(); // Renderizar la escena

  renderer.render(scene, camera);
}

function movePlayer() {
  // Calculamos las posiciones candidatas del jugador
  var nextX = player.position.x;
  var nextZ = player.position.z;

  if (keys.W) {
    nextX += (_readOnlyError("nextX"), moveSpeed * Math.sin(player.rotation.y));
    nextZ += (_readOnlyError("nextZ"), moveSpeed * Math.cos(player.rotation.y));
  }

  if (keys.A) {
    nextX += (_readOnlyError("nextX"), moveSpeed * Math.cos(player.rotation.y));
    nextZ -= (_readOnlyError("nextZ"), moveSpeed * Math.sin(player.rotation.y));
  }

  if (keys.S) {
    nextX -= (_readOnlyError("nextX"), moveSpeed * Math.sin(player.rotation.y));
    nextZ -= (_readOnlyError("nextZ"), moveSpeed * Math.cos(player.rotation.y));
  }

  if (keys.D) {
    nextX -= (_readOnlyError("nextX"), moveSpeed * Math.cos(player.rotation.y));
    nextZ += (_readOnlyError("nextZ"), moveSpeed * Math.sin(player.rotation.y));
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
} // Event listeners para el control de ratón


window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);
window.addEventListener("mousemove", onMouseMove, false); // Control de teclado para mover al jugador

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false); // Llamar a la función de animación

animate();
document.body.appendChild(renderer.domElement);