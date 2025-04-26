import {
  setupCanvas,
  handleMouseEvents,
  updatePointTable,
} from "./modules/canvasEvents.js";
import { initUI } from "./modules/uiControls.js";
import { animate, draw } from "./modules/draw.js";
import { addInitialPoints } from "./modules/initialPoints.js";

setupCanvas();
handleMouseEvents();
initUI();
addInitialPoints();
updatePointTable();
draw();
animate();
