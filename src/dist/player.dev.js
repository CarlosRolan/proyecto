"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.movePlayer = movePlayer;
exports.onKeyDown = onKeyDown;
exports.onKeyUp = onKeyUp;
exports.onMouseDown = onMouseDown;
exports.onMouseMove = onMouseMove;
exports.onMouseUp = onMouseUp;
exports.playerRotation = exports.mouseDown = exports.lastMouseX = exports.cameraRotation = exports.player = void 0;

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var player = initPlayer();
exports.player = player;
player.position.set(-95, 0.5, -95);
scene.add(player);

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

player.position.set(-95, 0.5, -95);

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
} // Control de ratón para rotar la cámara alrededor del jugador


var mouseDown = false;
exports.mouseDown = mouseDown;
var lastMouseX = null;
exports.lastMouseX = lastMouseX;
var cameraRotation = 0;
exports.cameraRotation = cameraRotation;
var playerRotation = 0;
exports.playerRotation = playerRotation;

function onMouseDown(event) {
  exports.mouseDown = mouseDown = (_readOnlyError("mouseDown"), true);
  exports.lastMouseX = lastMouseX = (_readOnlyError("lastMouseX"), event.clientX);
}

function onMouseUp(event) {
  exports.mouseDown = mouseDown = (_readOnlyError("mouseDown"), false);
  exports.lastMouseX = lastMouseX = (_readOnlyError("lastMouseX"), null);
  exports.playerRotation = playerRotation = (_readOnlyError("playerRotation"), cameraRotation);
}

function onMouseMove(event) {
  if (!mouseDown) return;
  var deltaX = event.clientX - lastMouseX;
  exports.cameraRotation = cameraRotation = cameraRotation - (_readOnlyError("cameraRotation"), deltaX * 0.001);
  exports.lastMouseX = lastMouseX = (_readOnlyError("lastMouseX"), event.clientX);
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