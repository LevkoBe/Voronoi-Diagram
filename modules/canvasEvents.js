import { state, draw } from "./draw.js";
import { genRandColor } from "./utils.js";

export function setupCanvas() {
  const canvas = document.getElementById("voronoiCanvas");
  state.canvas = canvas;
  // @ts-ignore
  state.ctx = canvas.getContext("2d");
  // @ts-ignore
  state.width = canvas.width;
  // @ts-ignore
  state.height = canvas.height;
}

export function handleMouseEvents() {
  const canvas = state.canvas;

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    state.points.push({ x, y });
    state.colors.push(genRandColor());
    updatePointTable();
    draw();
  });

  canvas.addEventListener("mouseenter", () => {
    state.isMouseOverCanvas = true;
  });

  canvas.addEventListener("mouseleave", () => {
    state.isMouseOverCanvas = false;
    document.getElementById("hoverPos").textContent = "Hover: Not over canvas";
    draw();
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    state.mousePoint.x = Math.floor((e.clientX - rect.left) * scaleX);
    state.mousePoint.y = Math.floor((e.clientY - rect.top) * scaleY);
    document.getElementById(
      "hoverPos"
    ).textContent = `Hover: (${state.mousePoint.x}, ${state.mousePoint.y})`;
  });
}

function updatePointTable() {
  const table = document.getElementById("pointTable");
  table.innerHTML = "<tr><th>X</th><th>Y</th><th>Delete</th></tr>";
  state.points.forEach((p, i) => {
    // @ts-ignore
    const row = table.insertRow();
    row.innerHTML = `
      <td><input type="number" value="${p.x}" onchange="updatePoint(${i}, 'x', this.value)"></td>
      <td><input type="number" value="${p.y}" onchange="updatePoint(${i}, 'y', this.value)"></td>
      <td><button class="button" onclick="deletePoint(${i})">Delete</button></td>
    `;
  });
}

// @ts-ignore
window.updatePoint = (i, key, val) => {
  state.points[i][key] = parseInt(val);
  draw();
};

// @ts-ignore
window.deletePoint = (i) => {
  state.points.splice(i, 1);
  state.colors.splice(i, 1);
  updatePointTable();
  draw();
};
