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
  ACTION_LOST
} from "../msg.mjs";

const wss = new WebSocketServer({ port: 5500 });
const playerIds = new Set();
// Example of generating a maze with different dimensions
const width = 25; // Must be an odd number
const height = 25; // Must be an odd number
const mazeData = generateMazeData(width, height);

function listenConnections() {
  wss.on("connection", function connection(ws) {
    console.log("onConnection");

    ws.on("message", function incoming(message) {
      handleClientMsg(JSON.parse(message), ws);
    });

    ws.on("close", function close() {
      handleClientExit(ws);
    });
  });
}

function generateMazeData(width, height) {
  if (width % 2 === 0 || height % 2 === 0) {
    throw new Error("Width and height must be odd numbers");
  }

  // Initialize the maze with walls (1s)
  let mazeData = Array.from({ length: height }, () => Array(width).fill(1));

  // Define directions for moving: [right, down, left, up]
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function isInBounds(x, y) {
    return x >= 0 && y >= 0 && x < height && y < width;
  }

  function carvePath(x, y) {
    mazeData[x][y] = 0;
    shuffle(directions);

    for (let [dx, dy] of directions) {
      let nx = x + 2 * dx;
      let ny = y + 2 * dy;
      if (isInBounds(nx, ny) && mazeData[nx][ny] === 1) {
        mazeData[x + dx][y + dy] = 0;
        carvePath(nx, ny);
      }
    }
  }

  // Start carving from the top-left corner
  carvePath(1, 1);

  // Ensure entrance and exit
  mazeData[0][1] = 0;  // Entrance
  mazeData[height - 1][width - 2] = 0;  // Exit

  return mazeData;
}

function sendMazeData(mazeData, ws) {

}
function getNumTotalPlayers() {
  return playerIds.length;
}


function handleClientMsg(message, ws) {
  const { ACTION, CONTENT } = message;

  console.log(message);

  switch (ACTION) {
    case ACTION_WIN:
      handlePlayerVictory(CONTENT, ws);
      break;
    case ACTION_ASK_MAZE_DATA:
      const mazeDataMsg = new Msg(ACTION_SEND_MAZE_DATA, mazeData);
      sendMsgToClient(ws, mazeDataMsg)
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

function sendMsgToClient(ws, msg) {
  ws.send(msg.pack());
}

listenConnections();

setInterval(() => {
  console.log(playerIds);
}, 3000);

export { mazeData };