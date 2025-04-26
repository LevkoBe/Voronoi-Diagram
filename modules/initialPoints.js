import { state } from "./draw.js";
import { genRandColor } from "./utils.js";

export function addInitialPoints(count = 7, range = 500) {
  const newPoints = Array.from({ length: count }, () => ({
    x: Math.round(Math.random() * range),
    y: Math.round(Math.random() * range),
  }));

  state.points.push(...newPoints);
  state.colors.push(...newPoints.map(() => genRandColor()));
}
