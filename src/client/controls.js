const keys = {
  W: false,
  A: false,
  S: false,
  D: false,
};

// Control de ratón para rotar la cámara alrededor del jugador
let mouseDown = false;
let lastMouseX = null;
let cameraRotation = 0;
let playerRotation = 0;

function calculateNewPos({ x, y, z }, speed) {
  if (keys.W) {
    x += speed * Math.sin(playerRotation);
    z += speed * Math.cos(playerRotation);
  }
  if (keys.A) {
    x += speed * Math.cos(playerRotation);
    z -= speed * Math.sin(playerRotation);
  }
  if (keys.S) {
    x -= speed * Math.sin(playerRotation);
    z -= speed * Math.cos(playerRotation);
  }
  if (keys.D) {
    x -= speed * Math.cos(playerRotation);
    z += speed * Math.sin(playerRotation);
  }

  return { x, y, z };
}

function onMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
}

function onMouseUp() {
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

function getRotation() {
  return playerRotation;
}

function onKeyChange(event, isPressed) {
  const key = event.key.toUpperCase();
  if (keys.hasOwnProperty(key)) {
    keys[key] = isPressed;
  }
}

function onKeyDown(event) {
  onKeyChange(event, true);
}

function onKeyUp(event) {
  onKeyChange(event, false);
}

const keyEvents = { onKeyDown, onKeyUp };
const mouseEvents = { onMouseDown, onMouseUp, onMouseMove };

export { keyEvents, mouseEvents, calculateNewPos, getRotation , cameraRotation };
