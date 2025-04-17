import { setupCanvas, handleMouseEvents } from "./modules/canvasEvents.js";
import { initUI } from "./modules/uiControls.js";
import { animate } from "./modules/draw.js";
import { addInitialPoints } from "./modules/initialPoints.js";

console.log("Hello from script.js");
setupCanvas();
handleMouseEvents();
initUI();
addInitialPoints();
// updatePointTable();
// draw();
// addInitialPoints();
animate();
