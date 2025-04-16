const canvas = document.getElementById("voronoiCanvas");
const ctx = canvas.getContext("2d");
const pointTable = document.getElementById("pointTable");
const metricSelector = document.getElementById("metric");
const gapInput = document.getElementById("gap");
const gapValue = document.getElementById("gapValue");
const hoverPos = document.getElementById("hoverPos");
const clearBtn = document.getElementById("clearPoints");

let points = [];
let colors = [];
let mousePoint = { x: 0, y: 0 };
let historicalMouse = { x: 0, y: 0 };
let frameCount = 0;
let isDrawing = false;
let isMouseOverCanvas = false;
const width = canvas.width;
const height = canvas.height;
const pointRadius = 5;

function randomColor() {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)})`;
}

function updatePointTable() {
  pointTable.innerHTML = "<tr><th>X</th><th>Y</th><th>Delete</th></tr>";
  points.forEach((p, i) => {
    const row = pointTable.insertRow();
    row.innerHTML = `
          <td><input type="number" value="${p.x}" onchange="updatePoint(${i}, 'x', this.value)"></td>
          <td><input type="number" value="${p.y}" onchange="updatePoint(${i}, 'y', this.value)"></td>
          <td><button class="button" onclick="deletePoint(${i})">Delete</button></td>
        `;
  });
}

window.updatePoint = (i, key, val) => {
  points[i][key] = parseInt(val);
  draw();
};

window.deletePoint = (i) => {
  points.splice(i, 1);
  colors.splice(i, 1);
  updatePointTable();
  draw();
};

function clearAllPoints() {
  points = [];
  colors = [];
  updatePointTable();
  draw();
}

clearBtn.addEventListener("click", clearAllPoints);

metricSelector.addEventListener("change", draw);

gapInput.addEventListener("input", function () {
  gapValue.textContent = this.value;
  draw();
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  points.push({ x, y });
  colors.push(randomColor());
  updatePointTable();
  draw();
});

canvas.addEventListener("mouseenter", () => {
  isMouseOverCanvas = true;
});

canvas.addEventListener("mouseleave", () => {
  isMouseOverCanvas = false;
  hoverPos.textContent = "Hover: Not over canvas";
  draw();
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  mousePoint.x = Math.floor((e.clientX - rect.left) * scaleX);
  mousePoint.y = Math.floor((e.clientY - rect.top) * scaleY);
  hoverPos.textContent = `Hover: (${mousePoint.x}, ${mousePoint.y})`;
});

document.getElementById("download").onclick = () => {
  const link = document.createElement("a");
  link.download = "voronoi.png";
  link.href = canvas.toDataURL();
  link.click();
};

function distance(p1, p2, metric) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  if (metric === "euclidean") return Math.sqrt(dx * dx + dy * dy);
  if (metric === "manhattan") return Math.abs(dx) + Math.abs(dy);
  if (metric === "chebyshev") return Math.max(Math.abs(dx), Math.abs(dy));
  return Infinity;
}

function draw() {
  if (isDrawing) return;
  isDrawing = true;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const allPoints = [...points];
  const allColors = [...colors];

  if (isMouseOverCanvas && points.length > 0) {
    allPoints.push(historicalMouse);
    allColors.push("rgb(0,0,0)");
  }

  const metric = metricSelector.value;
  const gap = parseFloat(gapInput.value);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minDist = Infinity;
      let secondMin = Infinity;
      let minIndex = -1;

      if (allPoints.length === 0) {
        const pixelIndex = (y * width + x) * 4;
        data[pixelIndex] = 240;
        data[pixelIndex + 1] = 240;
        data[pixelIndex + 2] = 240;
        data[pixelIndex + 3] = 255;
        continue;
      }

      for (let i = 0; i < allPoints.length; i++) {
        const d = distance({ x, y }, allPoints[i], metric);
        if (d < minDist) {
          secondMin = minDist;
          minDist = d;
          minIndex = i;
        } else if (d < secondMin) {
          secondMin = d;
        }
      }

      const diff = Math.abs(minDist - secondMin);
      const pixelIndex = (y * width + x) * 4;

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

  ctx.putImageData(imageData, 0, 0);

  // points dots
  ctx.save();
  points.forEach((point, i) => {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 2;

    // outer circle
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // inner circle
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointRadius - 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // mouse dot
  if (isMouseOverCanvas && points.length > 0) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(historicalMouse.x, historicalMouse.y, pointRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
  isDrawing = false;
}

function animate() {
  frameCount++;

  if (isMouseOverCanvas) {
    historicalMouse.x =
      historicalMouse.x + (mousePoint.x - historicalMouse.x) * 0.1;
    historicalMouse.y =
      historicalMouse.y + (mousePoint.y - historicalMouse.y) * 0.1;
  }

  if (frameCount % 3 === 0) {
    draw();
  }
  requestAnimationFrame(animate);
}

function addInitialPoints() {
  const initialPoints = [
    {
      x: 118,
      y: 167,
    },
    {
      x: 301,
      y: 502,
    },
    {
      x: 728,
      y: 391,
    },
    {
      x: 952.436806272913,
      y: 564.7735676253427,
    },
    {
      x: 953.4572776589728,
      y: 642.3309469090453,
    },
    {
      x: 822.354283853106,
      y: 894.496862285075,
    },
    {
      x: 33.27566388173175,
      y: 15.857915360708574,
    },
    {
      x: 609.6481427290171,
      y: 253.9498536409811,
    },
    {
      x: 939.3659402373587,
      y: 651.4922567914604,
    },
    {
      x: 680.8146670649364,
      y: 129.6918215184897,
    },
    {
      x: 503.9311531944953,
      y: 851.9869640865572,
    },
    {
      x: 845.6336886420079,
      y: 966.320526900811,
    },
    {
      x: 249.45198409948333,
      y: 111.70168891649135,
    },
    {
      x: 933.2622304108157,
      y: 120.45266873039672,
    },
    {
      x: 52.18062784299005,
      y: 259.5581725154219,
    },
    {
      x: 840.7237401011934,
      y: 391.5997861625955,
    },
    {
      x: 121.78465555897478,
      y: 392.31909099657645,
    },
    {
      x: 169.51443546119415,
      y: 244.0471541368028,
    },
    {
      x: 681.6619587331563,
      y: 24.176773237322593,
    },
    {
      x: 944.8983039669414,
      y: 14.450016392027255,
    },
    {
      x: 704.5162334236563,
      y: 223.17558026252505,
    },
    {
      x: 461.9914568589912,
      y: 873.954090482952,
    },
    {
      x: 865.3355497853111,
      y: 578.7456358340122,
    },
    {
      x: 186.39817335952358,
      y: 983.3980665591891,
    },
    {
      x: 943.9685335710476,
      y: 299.7388778238278,
    },
    {
      x: 20.592628931571543,
      y: 820.5699420821875,
    },
    {
      x: 347.021205995958,
      y: 868.8763891087576,
    },
    {
      x: 883.16382459767,
      y: 798.8027716270032,
    },
    {
      x: 658,
      y: 83,
    },
  ];

  initialPoints.forEach((p) => {
    points.push(p);
    colors.push(randomColor());
  });

  updatePointTable();
  draw();
}

addInitialPoints();
animate();
