import { WebSocketServer } from "ws";
import Msg, {
  ACTION_EXIT,
  ACTION_UPDATE,
  ACTION_NEW_PLAYER,
  ACTION_MSG,
  ACTION_REGISTER,
  ACTION_NEW_POS,
} from "./msg.mjs";

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
      handleClientMSG(JSON.parse(message), ws);
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
  });
}

function handleClientMSG(message, ws) {
  console.log("MSG FROM [" + ws.id + "]");
  console.log(message);

  const { ACTION, CONTENT } = message;

  switch (ACTION) {
    //NEW PLAYER IS
    case ACTION_REGISTER:
      const newPlayerId = CONTENT;
      ws.id = newPlayerId;
      playerIds.add(newPlayerId);
      wss.clients.forEach(function each(client) {
        if (client != ws) {
          const msg = new Msg(
            ACTION_NEW_PLAYER,
            "NEW PLAYER [" + newPlayerId + "]"
          );
          client.send(msg.pack());
        }
      });
      break;
    case ACTION_NEW_POS:
      const { id } = CONTENT;
      if (playerIds.has(id)) {
        wss.clients.forEach(function each(client) {
          if (client != ws) {
            const msg = new Msg(ACTION_NEW_POS, CONTENT);
            client.send(msg.pack());
          }
        });
      }
      break;

    default:
      console.log("object");
      break;
  }
}

listenConnections();
