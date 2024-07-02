import { WebSocketServer } from "ws";
import Msg, {
  ACTION_EXIT,
  ACTION_NEW_PLAYER,
  ACTION_NEW_POS,
  ACTION_REGISTER,
  ACTION_MSG,
  ACTION_ASK_MAZE_DATA,
  ACTION_SEND_MAZE_DATA,
  ACTION_WIN,
  ACTION_LOST, ACTION_MAP_INFO,
  ACTION_MAX_PLAYERS
} from "../msg.mjs";

const wss = new WebSocketServer({ port: 5500 });
const playerIds = new Set();

function listenConnections() {
  wss.on("connection", function connection(ws) {
    console.log("onConnection");

    ws.on("message", function incoming(message) {
      console.log("onMsg");
      handleClientMsg(JSON.parse(message), ws);
    });

    ws.on("close", function close() {
      console.log("onClose");
      onClientExit(ws);
    });
  });
}

//OnNewMsg from Client
function handleClientMsg(message, ws) {
  const { ACTION, CONTENT } = message;

  console.log(message);

  switch (ACTION) {

    case ACTION_WIN:
      onPlayerVictory(CONTENT, ws);
      break;

    case ACTION_REGISTER:
      onNewPlayer(CONTENT, ws);
      break;

    case ACTION_NEW_POS:
      onNewPosition(CONTENT);
      break;

    default:
      console.log("Unknown action:", ACTION);
      break;
  }
}

//On ACTION_WIN
function onPlayerVictory(playerId, ws) {
  const msgLost = new Msg(ACTION_LOST, playerId);
  broadcastExcept(ws, msgLost);
}

//On ACTION_REGISTER
function onNewPlayer(playerId, ws) {
  ws.id = playerId;
  if (playerIds.size < 3) {
    playerIds.add(playerId);
    //Sending msg to the rest of the players
    broadcastExcept(ws, new Msg(ACTION_NEW_PLAYER, playerId));
    //Sending msg to the player
    sendMsgToClient(ws, new Msg(ACTION_MAP_INFO, Array.from(playerIds)));
  } else {
    console.log("MAX Players reached");
    sendMsgToClient(ws, new Msg(ACTION_MAX_PLAYERS));
  }
}

//On ACTION_NEW_POS
function onNewPosition(content) {
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

//On CLOSE conection
function onClientExit(ws) {

  if (ws.id) {
    console.log("PLAYER[" + ws.id + "] has left");
    playerIds.delete(ws.id);
    console.log(playerIds);
    broadcastExcept(ws, new Msg(ACTION_EXIT, ws.id));
  }
}

//UTILS--
function sendMsgToClient(ws, msg) {
  try {
    ws.send(msg.pack());
  } catch (error) {
    console.log(error);
  }
}

function broadcast(content, msg) {
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

setInterval(() => {
  console.log(playerIds);
}, 3000);
