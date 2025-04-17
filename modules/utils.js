export function genRandColor() {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)})`;
}

export function distance(p1, p2, metric) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  if (metric === "euclidean") return Math.sqrt(dx * dx + dy * dy);
  if (metric === "manhattan") return Math.abs(dx) + Math.abs(dy);
  if (metric === "chebyshev") return Math.max(Math.abs(dx), Math.abs(dy));
  return Infinity;
}
