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
  if (metric === "canberra")
    return Math.abs(dx / (p2.x + 1e-8)) + Math.abs(dy / (p2.y + 1e-8));
  if (metric === "unknown1") return Math.abs(dx) * Math.abs(dy);
  if (metric === "unknown2") return Math.max(dx - dy, dy - dx);
  if (metric === "unknown3") return Math.min(Math.abs(dx), Math.abs(dy));
  if (metric === "unknown4") return Math.abs(dx) % (Math.abs(dy) + 1);
  return Infinity;
}
