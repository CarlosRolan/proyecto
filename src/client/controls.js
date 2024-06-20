const keys = {
  W: false,
  A: false,
  S: false,
  D: false,
  F: false,
  Space: false
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
  if (keys.Space) {
    y += 0.1;
  }

  if (keys.F) {
    y -= 0.1;
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
  if (event.code === 'Space') {
    keys["Space"] = isPressed;
    return;
  }
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

function onMouseScroll(camera) {
  console.log("onScroll");
  camera.position.set(x, camera.position.y++, z); // Adjust the y-coordinate to set the camera above the map
}


const keyEvents = { onKeyDown, onKeyUp };
const mouseEvents = { onMouseDown, onMouseUp, onMouseMove, onMouseScroll };

export { keyEvents, mouseEvents, calculateNewPos, getRotation, cameraRotation };
