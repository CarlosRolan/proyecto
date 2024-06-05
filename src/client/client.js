import { Player, p, enemies } from "./player.js";
import { updateEnemies, deleteEnemy } from "./scene.js";
import Msg, {
  ACTION_EXIT,
  ACTION_NEW_PLAYER,
  ACTION_NEW_POS,
  ACTION_REGISTER,
  ACTION_MSG
} from "../msg.mjs";

const ws = new WebSocket("ws://localhost:5500");

// Handle WebSocket events
ws.onopen = function () {
  console.log("Connection established");
  registerPlayer();
};

ws.onmessage = function ({ data }) {
  handleServerResponse(JSON.parse(data));
};

ws.onerror = function (error) {
  console.error("WebSocket error:", error);
};

ws.onclose = function () {
  console.log("Connection closed");
};

function registerPlayer() {
  const msg = new Msg(ACTION_REGISTER, p.id);
  sendMessage(msg);
}

function sendPosition(position) {
  const msg = new Msg(ACTION_NEW_POS, position);
  sendMessage(msg);
}
function handlePlayerWin() {
  // Show the "YOU WIN" message
  const youWinMessage = document.getElementById("youWinMessage");
  youWinMessage.style.display = "block";

  // Fade the screen to black
  const blackOverlay = document.getElementById("blackOverlay");
  blackOverlay.style.opacity = "1";

  // Optionally, add a delay before transitioning to the next screen or resetting the game
  setTimeout(() => {
    window.location = "index.html";
  }, 3000); // Adjust the delay time as needed
}

function win(player) {
  const {id} = player;
  console.log(id);
  handlePlayerWin();
}

function sendMessage(msg) {
  if (ws.readyState === ws.OPEN) {
    ws.send(msg.pack());
  }
}

function handleServerResponse(serverMsg) {
  console.log("Message from server:", serverMsg);
  const { ACTION, CONTENT } = serverMsg;

  switch (ACTION) {
    case ACTION_MSG:
      console.log(CONTENT);
      break;

    case ACTION_EXIT:
      console.log("Deleting a player");
      deleteEnemy(CONTENT);
      break;

    case ACTION_NEW_POS:
      console.log("Updating enemy position");
      const { id, position, rotation } = CONTENT;
      updateEnemyPosition(id, position, rotation);
      break;

    default:
      console.log("No action specified");
      break;
  }
}

function updateEnemyPosition(id, position, rotation) {
  let existingEnemy = false;

  enemies.forEach(e => {
    if (e.id == id) {
      e.move(position.x, position.y, position.z);
      e.rotate(rotation);
      return;
    }
  });

  if (existingEnemy) {

  } else {
    const newEnemy = new Player(id);
    newEnemy.move(position.x, position.y, position.z);
    newEnemy.rotate(rotation);
    enemies.add(newEnemy);
  }

  updateEnemies(enemies);
}

export { sendPosition, win };
