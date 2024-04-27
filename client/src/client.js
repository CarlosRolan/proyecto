import { Player, p, enemies } from "./player.js";
import { updateEnemies } from "./scene.js";

const ws = new WebSocket("ws://localhost:5500");

// Manejar eventos, como onopen, onmessage, etc.
ws.onopen = function () {
  console.log("Conexión establecida");
  try {
    sendId(p.id);
  } catch (error) {
    ws.send(error);
  }
};

ws.onmessage = function (event) {
  try {
    const serverMsg = JSON.parse(event.data);

    console.log(serverMsg);

    if (serverMsg != null) {
      const enemy = new Player(serverMsg.id);

      let isThere = false;

      enemies.forEach((e) => {
        if (e.id == enemy.id) {
          isThere = true;
          const { x, y, z } = serverMsg.position;
          e.move(x, y, z);
          e.rotate(serverMsg.rotation)
        }
      });

      if (!isThere) {
        enemies.add(enemy);
        updateEnemies(enemies);
      }
    }
  } catch (error) {
    console.log(error);
    console.log(event.data);
  }
};

ws.onerror = function (error) {
  console.error("Error:", error);
};

ws.onclose = function () {
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

export { sendPosition };
