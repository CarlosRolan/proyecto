import { WebSocketServer } from "ws";
import Msg, {
  ACTION_EXIT,
  ACTION_NEW_PLAYER,
  ACTION_NEW_POS,
  ACTION_REGISTER,
} from "../msg.mjs";

const wss = new WebSocketServer({ port: 5500 });

const playerIds = new Set();

function listenConnections() {
  wss.on("connection", function connection(ws) {
    ws.id = generateId();
    playerIds.add(ws.id);

    broadcastExcept(ws, new Msg(ACTION_NEW_PLAYER, "NEW PLAYER [" + ws.id + "]"));

    ws.on("message", function incoming(message) {
      handleClientMsg(JSON.parse(message), ws);
    });

    ws.on("close", function close() {
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
  if (playerIds.has(id)) {
    broadcast(new Msg(ACTION_NEW_POS, content));
  }
}

function handleClientExit(ws) {
  if (ws.id) {
    playerIds.delete(ws.id);
    broadcastExcept(ws, new Msg(ACTION_EXIT, ws.id));
  }
}

function broadcast(message) {
  wss.clients.forEach(function each(client) {
    client.send(message.pack());
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
