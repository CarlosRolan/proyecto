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
      handleClientExit(ws);
    });
  });
}


function handleClientMsg(message, ws) {
  const { ACTION, CONTENT } = message;

  console.log(message);

  switch (ACTION) {

    case ACTION_WIN:
      handlePlayerVictory(CONTENT, ws);
      break;

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

function handlePlayerVictory(playerId, ws) {
  const msgLost = new Msg(ACTION_LOST, playerId);
  broadcastExcept(ws, msgLost);
}

function handleNewPlayer(playerId, ws) {
  ws.id = playerId;
  if (playerIds.size < 3) {
    playerIds.add(playerId);
    //Sending msg to the rest of the players
    broadcastExcept(ws, new Msg(ACTION_NEW_PLAYER, playerId));
    //Sending msg to the player
    sendMsgToClient(ws, new Msg(ACTION_MAP_INFO, Array.from(playerIds)));
  } else {
    sendMsgToClient(ws, new Msg(ACTION_MAX_PLAYERS));
  }
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
    console.log("PLAYER[" + ws.id + "] has left");
    playerIds.delete(ws.id);
    console.log(playerIds);
    broadcastExcept(ws, new Msg(ACTION_EXIT, ws.id));
  }
}

function sendMsgToClient(ws, msg) {
  try {
    ws.send(msg.pack());
  } catch (error) {
    console.log(error);
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

setInterval(() => {
  console.log(playerIds);
}, 3000);
