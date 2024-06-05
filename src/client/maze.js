import * as THREE from "../../three/build/three.module.js";

function generateMaze(width, height) {
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

// Example of generating a maze with different dimensions
const width = 101; // Must be an odd number
const height = 101; // Must be an odd number
const mazeData = generateMaze(width, height);

// Cell size of the maze
const cellSize = 2;
const halfCellSize = cellSize / 2;

function initMaze() {
  const mazeGroup = new THREE.Group();
  const wallGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);

  // Load the bush texture
  const textureLoader = new THREE.TextureLoader();
  const bushTexture = textureLoader.load('res/img/texture_maze.jpg'); // Replace with your texture file path
  const wallMaterial = new THREE.MeshBasicMaterial({ map: bushTexture });

  const offsetX = (mazeData[0].length / 2) * cellSize; // Adjusted for maze width
  const offsetZ = (mazeData.length / 2) * cellSize;

  for (let i = 0; i < mazeData.length; i++) {
    for (let j = 0; j < mazeData[i].length; j++) {
      if (mazeData[i][j] === 1) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(j * cellSize - offsetX + halfCellSize, 1, i * cellSize - offsetZ + halfCellSize);
        mazeGroup.add(wall);
      }
    }
  }

  return mazeGroup;
}


console.log(mazeData);

const maze = initMaze();

export { maze };
