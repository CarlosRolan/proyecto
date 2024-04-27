import { strFromU8 } from "three/examples/jsm/libs/fflate.module.js";
import { WebSocketServer } from "ws";
import Msg, { ACTION_EXIT, ACTION_UPDATE, ACTION_MSG } from "./msg.mjs";

const wss = new WebSocketServer({ port: 5500 });

const playerIds = new Set();

function listenConnections() {
  //CHANNEL STABLISH
  wss.on("connection", function connection(ws) {
    // Manejar eventos del WebSocket
    ws.on("open", function () {
      console.log("Evento: open");
    });

    // Manejar mensajes entrantes desde el cliente
    ws.on("message", function incoming(message) {
      // Aquí puedes procesar los mensajes recibidos del cliente, como la posición del jugador
      //TODO posicion
      //console.log("Mensaje recibido desde el cliente:", strFromU8(message));
      try {
        const json = JSON.parse(message);
        if (playerIds.has(json.id)) {
          wss.clients.forEach(function each(client) {
            if (client != ws) {
              console.log("Update " + client.id);
              const msg = new Msg(ACTION_UPDATE, JSON.stringify(json));
              client.send(msg.pack());
            }
          });
        } else {
          console.log("New player connected" + json);
          console.log("JUGADORES TOTALES " + wss.clients.size);
          ws.id = json;
          playerIds.add(json);
          wss.clients.forEach(function each(client) {
            if (client != ws) {
              const msg = new Msg(ACTION_MSG, client.id);
              client.send(msg.pack());
            }
          });
        }
      } catch (error) {
        console.log("ERROR al parsear a JSON");
        console.log(error);
      }

      // wss.clients.forEach(function each(client) {
      //   if (client.readyState == ws.OPEN) {
      //     console.log("enviando msg");
      //     client.send(message);
      //   }
      // });
    });

    ws.on("error", function (error) {
      console.error("Evento: error", error);
    });

    // Manejar cierre de conexión
    ws.on("close", function close() {
      wss.clients.forEach(function each(client) {
        if (client != ws) {
          const msg = new Msg(ACTION_EXIT, ws.id);
          client.send(msg.pack());
        }
      });
      console.log("Jugador desconectado");
      console.log("JUGADORES TOTALES " + wss.clients.size);
    });

    // Generar un ID único para el jugador
    //const newPlayerConn = new PlayerConn(playerId, ws);

    //players[playerId] = newPlayerConn;
    //console.log(players[playerId]);
    //players[playerId].sendPlayerId(playerId);
  });
}

// Función para enviar un mensaje a todos los clientes
function broadcast(message, ws) {
  // Por ejemplo, puedes transmitir este mensaje a todos los otros clientes
  wss.clients.forEach(function each(client) {
    if (client.readyState == 1 && client != ws) {
      client.send("SERVER OK");
    }
    /*if (client !== ws && client.readyState == ws.OPEN) {
    console.log("enviando msg");
    client.send(message);
  }*/
  });
}

listenConnections();

// setInterval(() => {
//   broadcast("CONNECTED");
// }, 5000);
