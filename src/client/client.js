import { Player, p, enemies } from "./player.js";
import { updateEnemies, deleteEnemy } from "./scene.js";
import Msg, {
  ACTIONS
} from "../msg.mjs";

const ws = new WebSocket("ws://192.168.1.63:5500");

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
  const msg = new Msg(ACTIONS.ACTION_REGISTER, p.id);
  sendMessage(msg);
}

function sendPosition(position) {
  const msg = new Msg(ACTIONS.ACTION_NEW_POS, position);
  sendMessage(msg);
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
    case ACTIONS.ACTION_MSG:
      console.log(CONTENT);
      break;

    case ACTIONS.ACTION_EXIT:
      console.log("Deleting a player");
      deleteEnemy(CONTENT);
      break;

    case ACTIONS.ACTION_NEW_POS:
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
  let existingEnemy = enemies.find((enemy) => enemy.id === id);

  if (existingEnemy) {
    existingEnemy.move(position.x, position.y, position.z);
    existingEnemy.rotate(rotation);
  } else {
    const newEnemy = new Player(id);
    newEnemy.move(position.x, position.y, position.z);
    newEnemy.rotate(rotation);
    enemies.add(newEnemy);
  }

  updateEnemies(enemies);
}

export { sendPosition };
