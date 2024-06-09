import { animate } from "./scene.js";
import { p } from "./player.js";
import { renderer } from "./renderer.js";

// Call the animation function
animate();

// Display the player's ID on the webpage
document.getElementById("idLb").textContent = p.id;
