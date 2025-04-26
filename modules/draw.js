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
  const optimisation = parseFloat(
    // @ts-ignore
    document.getElementById("optimisation").value
  );

  const skip = Math.max(1, Math.floor(optimisation));
  const numPoints = allpoints.length;
  const width = state.width;
  const height = state.height;

  if (numPoints === 0) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  } else {
    const colorCache = {};
    allColors.forEach((c, i) => {
      const [r, g, b] = c.match(/\d+/g).map(Number);
      colorCache[i] = [r, g, b];
    });

    for (let y = 0; y < height; y += skip) {
      for (let x = 0; x < width; x += skip) {
        let minDist = Infinity;
        let closestIndex = 0;

        for (let i = 0; i < numPoints; i++) {
          const p = allpoints[i];
          const d = distance({ x, y }, p, metric);
          if (d < minDist) {
            minDist = d;
            closestIndex = i;
          }
        }

        const [r, g, b] = colorCache[closestIndex];

        for (let dy = 0; dy < skip && y + dy < height; dy++) {
          for (let dx = 0; dx < skip && x + dx < width; dx++) {
            const idx = 4 * ((y + dy) * width + (x + dx));
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }
    }
  }

  state.ctx.putImageData(imageData, 0, 0);

  // points dots
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
