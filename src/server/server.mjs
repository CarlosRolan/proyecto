import { WebSocketServer } from "ws";
import Msg, {
  ACTION_EXIT,
  ACTION_NEW_PLAYER,
  ACTION_NEW_POS,
  ACTION_REGISTER,
  ACTION_MSG
} from "../msg.mjs";

const wss = new WebSocketServer({ port: 5500 });

const playerIds = new Set();

function listenConnections() {
  wss.on("connection", function connection(ws) {
    console.log("onConnection");
    ws.id = generateId();
    playerIds.add(ws.id);

    broadcastExcept(ws, new Msg(ACTION_NEW_PLAYER, "NEW PLAYER [" + ws.id + "]"));

    ws.on("message", function incoming(message) {
      console.log("onMessage");
      handleClientMsg(JSON.parse(message), ws);
    });

    ws.on("close", function close() {
      console.log("onClose");
      handleClientExit(ws);
    });
  });
}

function generateId() {
  let id;
  do {
    id = Math.random().toString(36).substring(2, 8);
  } while (playerIds.has(id));
  return id;
}

function handleClientMsg(message, ws) {
  const { ACTION, CONTENT } = message;

  console.log(message);

  switch (ACTION) {
    case ACTION_REGISTER:
      handleNewPlayer(CONTENT, ws);
      break;
    case ACTION_NEW_POS:
      handleNewPosition(CONTENT);
      break;
    default:
      console.log("Unknown action:", ACTION);
      break;
  }
}

function handleNewPlayer(playerId, ws) {
  ws.id = playerId;
  playerIds.add(playerId);

  broadcastExcept(ws, new Msg(ACTION_NEW_PLAYER, "NEW PLAYER [" + playerId + "]"));
}

function handleNewPosition(content) {
  const { id } = content;
  const msg = new Msg(ACTION_NEW_POS, content)
  if (playerIds.has(id)) {
    wss.clients.forEach(function each(client) {
      if (client.id != id) {
        client.send(msg.pack());
      }
    });
  }
}

function handleClientExit(ws) {
  if (ws.id) {
    playerIds.delete(ws.id);
    broadcastExcept(ws, new Msg(ACTION_EXIT, ws.id));
  }
}

function broadcast(content) {
  const msg = new Msg(ACTION_NEW_POS, content)
  wss.clients.forEach(function each(client) {
    client.send(msg.pack());
  });
}

function broadcastExcept(excludedClient, message) {
  wss.clients.forEach(function each(client) {
    if (client !== excludedClient) {
      client.send(message.pack());
    }
  });
}

listenConnections();
