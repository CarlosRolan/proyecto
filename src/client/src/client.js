import { Player, p, enemies } from "./player.js";
import { updateEnemies, deleteEnemy } from "./scene.js";
import Msg, {
  ACTION_EXIT,
  ACTION_MSG,
  ACTION_UPDATE,
  ACTION_REGISTER,
} from "../../msg.mjs";

const ws = new WebSocket("ws://192.168.1.63:5500");

// Manejar eventos, como onopen, onmessage, etc.
ws.onopen = function () {
  console.log("Conexión establecida");
  try {
    const msg = new Msg(ACTION_REGISTER, p.id);
    sendId(msg.pack());
  } catch (error) {
    ws.send(error);
  }
};

ws.onmessage = function (event) {
  try {
    const serverMsg = JSON.parse(event.data);
    handleServerResponse(serverMsg);
  } catch (error) {
    console.log(error);
    console.log(event.data);
  }
};

ws.onerror = function (error) {
  console.error("Error:", error);
};

ws.onclose = function (args) {
  console.log("Conexión cerrada");
};

function sendPosition(position) {
  if (ws.readyState == ws.OPEN) ws.send(position);
}

function sendId(id) {
  if (id != null) {
    ws.send(id);
  }
}

function handleServerResponse(serverMsg) {
  console.log(serverMsg);

  const ACTION = serverMsg.action;

  const CONTENT = JSON.parse(serverMsg.content);

  switch (ACTION) {
    case ACTION_MSG:
      console.log(CONTENT);
      break;
    case ACTION_EXIT:
      console.log("ACCION DE ELIMINAR JUGADOR");
      deleteEnemy(CONTENT);
      break;
    case ACTION_UPDATE:
      const enemy = new Player(CONTENT.id);

      let isThere = false;

      enemies.forEach((e) => {
        if (e.id == enemy.id) {
          isThere = true;
          const { x, y, z } = CONTENT.position;
          e.move(x, y, z);
          e.rotate(CONTENT.rotation);
        }
      });

      if (!isThere) {
        enemies.add(enemy);
      }

      updateEnemies(enemies);

      break;
    default:
      console.log("default");
      break;
  }
}

setTimeout(() => {}, 3000);

export { sendPosition };
