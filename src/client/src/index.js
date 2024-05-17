import { animate } from "./scene.js";
import { p } from "./player.js";

// Llamar a la función de animación
animate();

document.getElementById("infoPanel").innerHTML = p.id;
