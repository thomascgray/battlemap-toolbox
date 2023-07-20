// @ts-nocheck
// taken completely from https://stackoverflow.com/questions/72661662/draw-grid-with-hexagons-using-canvas-html-javascript
const TAU = 2 * Math.PI;

const defaultGridOptions = {
  radius: 40,
  sides: 6,
  inset: 0,
  // Context
  fillStyle: "",
  strokeStyle: "white",
  // Other
  randomColors: null,
};

export const drawGrid = (ctx, x, y, w, h, options = {}) => {
  const opts = { ...defaultGridOptions, ...options };
  const points = createPoly(opts);
  opts.diameter = opts.radius * 2;
  for (let gy = y; gy < y + h; gy++) {
    for (let gx = x; gx < x + w; gx++) {
      ctx.fillStyle = opts.randomColors
        ? pickRandom(opts.randomColors)
        : opts.fillStyle;
      drawPoly(ctx, gridToPixel(gx, gy, opts), points, opts);
    }
  }
};

const gridToPixel = (gridX, gridY, opts) => {
  const m = gridMeasurements(opts);
  return toPoint(
    Math.floor(gridX * m.gridSpaceX),
    Math.floor(gridY * m.gridSpaceY + (gridX % 2 ? m.gridOffsetY : 0))
  );
};

const drawPoly = (ctx, origin, points, opts) => {
  ctx.strokeStyle = opts.strokeStyle;
  ctx.save();
  ctx.translate(origin.x, origin.y);
  polyPath3(ctx, points);
  ctx.restore();
  if (opts.fillStyle || opts.randomColors) ctx.fill();
  if (opts.strokeStyle) ctx.stroke();
};

const createPoly = (opts, points = []) => {
  const { inset, radius, sides } = opts,
    size = radius - inset,
    step = TAU / sides;
  for (let i = 0; i < sides; i++) {
    points.push(toPolarCoordinate(0, 0, size, step * i));
  }
  return points;
};

const gridMeasurements = (opts) => {
  const { diameter, inset, radius, sides } = opts,
    edgeLength = Math.sin(Math.PI / sides) * diameter,
    gridSpaceX = diameter - edgeLength / 2,
    gridSpaceY = Math.cos(Math.PI / sides) * diameter,
    gridOffsetY = gridSpaceY / 2;
  return {
    diameter,
    edgeLength,
    gridSpaceX,
    gridSpaceY,
    gridOffsetY,
  };
};

const polyPath2 = (ctx, points = []) => {
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length - 1; i += 2) {
    ctx.lineTo(points[i], points[i + 1]);
  }
  ctx.closePath();
};

const polyPath3 = (ctx, points = []) => {
  const [{ x: startX, y: startY }] = points;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  points.forEach(({ x, y }) => {
    ctx.lineTo(x, y);
  });
  ctx.closePath();
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const toPoint = (x, y) => ({ x, y });

const fromPoint = ({ x, y }) => [x, y];

const toPolarCoordinate = (centerX, centerY, radius, angle) => ({
  x: centerX + radius * Math.cos(angle),
  y: centerY + radius * Math.sin(angle),
});

const toPolarCoordinate2 = (centerX, centerY, radius, sides, i) =>
  toPolarCoordinate(centerX, centerY, radius, i === 0 ? 0 : (i * TAU) / sides);

const generateColors = (
  count,
  saturation = 1.0,
  lightness = 0.5,
  alpha = 1.0
) =>
  Array.from(
    { length: count },
    (_, i) =>
      `hsla(${[
        Math.floor((i / count) * 360),
        `${Math.floor(saturation * 100)}%`,
        `${Math.floor(lightness * 100)}%`,
        alpha,
      ].join(", ")})`
  );
