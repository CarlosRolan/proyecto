import { Player, p, enemies } from "./player.js";
import { updateEnemies, deleteEnemy } from "./scene.js";
import Msg, {
  ACTION_EXIT,
  ACTION_NEW_PLAYER,
  ACTION_NEW_POS,
  ACTION_REGISTER,
  ACTION_MSG,
  ACTION_ASK_MAZE_DATA,
  ACTION_SEND_MAZE_DATA,
  ACTION_WIN,
  ACTION_LOST
} from "../msg.mjs";
import { loossingSound } from "./audioLoader.js";



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
function handleEndGame(text) {
  // Show the "YOU WIN" message
  const endMsg = document.getElementById("endMsg");
  endMsg.innerHTML = text;
  endMsg.style.display = "block";

  // Fade the screen to black
  const blackOverlay = document.getElementById("blackOverlay");
  blackOverlay.style.opacity = "1";

  // Optionally, add a delay before transitioning to the next screen or resetting the game
  setTimeout(() => {
    window.location = "index.html";
  }, 3000); // Adjust the delay time as needed
}

function win(player) {
  const { id } = player;
  console.log(id);
  handleEndGame("WIN");
  const winMsg = new Msg(ACTION_WIN, player.id);
  sendMessage(winMsg);
}

function lost() {
  handleEndGame("LOST");
  loossingSound.play();
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
    case ACTION_SEND_MAZE_DATA:
      console.log("Getting the map data");
      break;
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

    case ACTION_LOST:
      const playerWhoWin = CONTENT;
      console.log(playerWhoWin);
      lost();
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

function askForMazeData() {
  const msg = new Msg(ACTION_ASK_MAZE_DATA);
  sendMessage(msg);
}


export { sendPosition, win, lost };
