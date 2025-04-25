export function genRandColor() {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)})`;
}

/**
 * @param {{ x: number; y: number; }} p1
 * @param {{ x: number; y: number; }} p2
 * @param {string} metric
 */
export function distance(p1, p2, metric) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  switch (metric) {
    case "euclidean":
      return Math.sqrt(dx * dx + dy * dy);
    case "manhattan":
      return Math.abs(dx) + Math.abs(dy);
    case "chebyshev":
      return Math.max(Math.abs(dx), Math.abs(dy));
    case "canberra":
      return Math.abs(dx / (p2.x + 1e-8)) + Math.abs(dy / (p2.y + 1e-8));
    case "unknown1":
      return Math.abs(dx) * Math.abs(dy);
    case "unknown2":
      return Math.max(dx - dy, dy - dx);
    case "unknown3":
      return Math.min(Math.abs(dx), Math.abs(dy));
    case "unknown4":
      return Math.abs(dx) % (Math.abs(dy) + 1);
    default:
      return Infinity;
  }
}
