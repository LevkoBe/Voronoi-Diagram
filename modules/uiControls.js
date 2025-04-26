import { draw, state } from "./draw.js";

export function initUI() {
  document.getElementById("clearPoints").addEventListener("click", () => {
    console.log("Clearing points");
    state.points = [];
    state.colors = [];
    draw();
    console.log(state);
  });

  document.getElementById("metric").addEventListener("change", draw);

  document
    .getElementById("optimisation")
    .addEventListener("input", function () {
      // @ts-ignore
      document.getElementById("optimisationValue").textContent = this.value;
      draw();
    });

  document.getElementById("download").onclick = () => {
    const link = document.createElement("a");
    link.download = "voronoi.png";
    link.href = state.canvas.toDataURL();
    link.click();
  };
}
