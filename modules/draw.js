import { distance } from "./utils.js";

export const state = {
  pointRadius: 5,
  frameCount: 0,
  height: 0,
  width: 0,
  points: [],
  colors: [],
  ctx: null,
  canvas: null,
  isDrawing: false,
  isMouseOverCanvas: false,
  mousePoint: { x: 0, y: 0 },
  historicalMouse: { x: 0, y: 0 },
};

export function draw() {
  if (state.isDrawing) return;
  state.isDrawing = true;

  const imageData = state.ctx.createImageData(state.width, state.height);
  const data = imageData.data;
  const allpoints = [...state.points];
  const allColors = [...state.colors];

  if (state.isMouseOverCanvas && state.points.length > 0) {
    allpoints.push(state.historicalMouse);
    allColors.push("rgb(0,0,0)");
  }

  // @ts-ignore
  const metric = document.getElementById("metric").value;
  // @ts-ignore
  const gap = parseFloat(document.getElementById("gap").value);

  for (let y = 0; y < state.height; y++) {
    for (let x = 0; x < state.width; x++) {
      let minDist = Infinity;
      let secondMin = Infinity;
      let minIndex = -1;

      if (allpoints.length === 0) {
        const pixelIndex = (y * state.width + x) * 4;
        data[pixelIndex] = 240;
        data[pixelIndex + 1] = 240;
        data[pixelIndex + 2] = 240;
        data[pixelIndex + 3] = 255;
        continue;
      }

      for (let i = 0; i < allpoints.length; i++) {
        const d = distance({ x, y }, allpoints[i], metric);
        if (d < minDist) {
          secondMin = minDist;
          minDist = d;
          minIndex = i;
        } else if (d < secondMin) {
          secondMin = d;
        }
      }

      const diff = Math.abs(minDist - secondMin);
      const pixelIndex = (y * state.width + x) * 4;

      if (diff < gap) {
        data[pixelIndex] = 0;
        data[pixelIndex + 1] = 0;
        data[pixelIndex + 2] = 0;
        data[pixelIndex + 3] = 255;
      } else {
        let r = 0,
          g = 0,
          b = 0;
        const color = allColors[minIndex];

        const matches = color.match(/\d+/g);
        if (matches && matches.length >= 3) {
          [r, g, b] = matches.map(Number);
        }

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
  }

  state.ctx.putImageData(imageData, 0, 0);

  // state.points dots
  state.ctx.save();
  state.points.forEach((point, i) => {
    state.ctx.fillStyle = "white";
    state.ctx.strokeStyle = "rgb(0,0,0)";
    state.ctx.lineWidth = 2;

    // outer circle
    state.ctx.beginPath();
    state.ctx.arc(point.x, point.y, state.pointRadius, 0, Math.PI * 2);
    state.ctx.fill();
    state.ctx.stroke();

    // inner circle
    state.ctx.fillStyle = state.colors[i];
    state.ctx.beginPath();
    state.ctx.arc(point.x, point.y, state.pointRadius - 2, 0, Math.PI * 2);
    state.ctx.fill();
  });

  // mouse dot
  if (state.isMouseOverCanvas && state.points.length > 0) {
    state.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    state.ctx.beginPath();
    state.ctx.arc(
      state.historicalMouse.x,
      state.historicalMouse.y,
      state.pointRadius,
      0,
      Math.PI * 2
    );
    state.ctx.fill();
    state.ctx.stroke();
  }

  state.ctx.restore();
  state.isDrawing = false;
}

export function animate() {
  state.frameCount++;

  if (state.isMouseOverCanvas) {
    state.historicalMouse.x +=
      (state.mousePoint.x - state.historicalMouse.x) * 0.1;
    state.historicalMouse.y +=
      (state.mousePoint.y - state.historicalMouse.y) * 0.1;
  }

  if (state.frameCount % 3 === 0) draw();
  requestAnimationFrame(animate);
}
