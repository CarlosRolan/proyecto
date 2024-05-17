import { Player, p, enemies } from "./player.js";
import { updateEnemies, deleteEnemy } from "./scene.js";
import Msg, {
  ACTION_EXIT,
  ACTION_MSG,
  ACTION_UPDATE,
  ACTION_REGISTER,
  ACTION_NEW_POS,
  ACTION_NEW_PLAYER,
} from "../../msg.mjs";

const ws = new WebSocket("ws://192.168.1.63:5500");

// Manejar eventos, como onopen, onmessage, etc.
ws.onopen = function () {
  console.log("CONECXION ESTABLISHED");
  try {
    const msg = new Msg(ACTION_REGISTER, p.id);
    ws.send(msg.pack());
  } catch (error) {
    ws.send(error);
  }
};

ws.onmessage = function ({ data }) {
  try {
    handleServerResponse(JSON.parse(data));
  } catch (error) {
    console.log(error);
  }
};

ws.onerror = function (error) {
  console.error("Error:", error);
};

ws.onclose = function (args) {
  console.log("Conecxion CLOSED");
};

function sendPosition(position) {
  const msg = new Msg(ACTION_NEW_POS, position);
  if (ws.readyState == ws.OPEN) ws.send(msg.pack());
}

function handleServerResponse(serverMsg) {
  console.log("MSG FROM SERVER");
  const { ACTION, CONTENT } = serverMsg;

  console.log(serverMsg);

  switch (ACTION) {
    case ACTION_MSG:
      console.log(CONTENT);
      break;

    case ACTION_EXIT:
      console.log("DELETING A PLAYER");
      deleteEnemy(CONTENT);
      break;

    case ACTION_NEW_POS:
      console.log("UPDATING ENEMY POS");
      const { id, position, rotation } = CONTENT;
      const enemy = new Player(id);

      let isThere = false;

      enemies.forEach((e) => {
        if (e.id == enemy.id) {
          isThere = true;
          const { x, y, z } = position;
          e.move(x, y, z);
          e.rotate(rotation);
        }
      });

      if (!isThere) {
        enemies.add(enemy);
      }

      updateEnemies(enemies);
      break;

    default:
      console.log("NO ACTION");
      break;
  }
}

export { sendPosition };
