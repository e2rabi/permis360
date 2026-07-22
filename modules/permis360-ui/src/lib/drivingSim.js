// Pure helpers for the canvas driving simulator — kept separate from the React
// component so the game loop can stay lean and easy to reason about.
//
// Three camera modes share the same gameplay data:
//  - 'chase'   : pseudo-3D third-person view behind the car (a single depth
//                parameter t drives both vertical position and width/curve
//                scaling, so the road converges to a vanishing point).
//  - 'cockpit' : the same pseudo-3D road, but seen through the windshield —
//                no car body is drawn, instead a dashboard + steering wheel
//                HUD sits fixed at the bottom of the screen.
//  - 'top'     : a simple top-down overview with straight lanes, useful as
//                a full-picture "map-like" view of what's ahead.

export const LANES = 3;
export const CANVAS_W = 340;
export const CANVAS_H = 520;
export const DEFAULT_LIMIT = 60;
export const MAX_SPEED = 130;
export const ACCEL = 30; // km/h per second
export const BRAKE = 58;
export const FRICTION = 11;
export const PASS_SCORE = 70;
export const GAME_TIME_LIMIT = 150; // seconds, safety net if the player idles

const HORIZON_Y = 165;
const ROAD_MAX_WIDTH = 258; // road width at the very bottom of the screen (chase/cockpit)
const VIEW_DISTANCE = 150; // meters rendered ahead of the car
const TOP_SCALE = 3.2; // px per meter for the top-down camera
const TOP_ROAD_WIDTH = 210;

const COLORS = {
  roadA: '#33352f',
  roadB: '#3a3c34',
  shoulder: '#c9a66b',
  shoulderDark: '#b6935a',
  dash: '#f4f1e8',
  edge: '#f4f1e8',
  skyTop: '#7fb0c9',
  skyHorizon: '#e8c088',
  sun: '#fbe3a1',
  mountain: '#a97e63',
  mountainFar: '#c8a184',
  // Dacia-esque body: a practical satin white with charcoal trim, like a
  // typical Logan/Sandero driving-school car.
  carBody: '#eef1ef',
  carBodyShade: '#d7dbd7',
  carTrim: '#2b2e2c',
  carWindow: '#3a4a48',
  carWindowShine: '#8fa9a5',
  carLight: '#ffce8a',
  carLightRed: '#c1272d',
  obstacle: '#8a2f22',
  obstacleWindow: '#3a2420',
  stopRed: '#C1272D',
  blue: '#1959A8',
  white: '#ffffff',
  gray: '#8a8a8a',
  ink: '#1C1B17',
  palmTrunk: '#6b4a2f',
  palmLeaf: '#3c6b46',
  dash1: '#232622',
  dash2: '#2f322e',
  wheel: '#181a18',
  wheelHub: '#4a4e49',
};

// Base lane offset in "near field" pixel space — Simulator.jsx lerps the car's
// rendered X toward this when the player changes lanes, in meters-agnostic
// road space; the perspective curve/scale is applied on top at draw time.
export const laneCenterX = (lane) => CANVAS_W / 2 + (lane - 1) * (ROAD_MAX_WIDTH / LANES);

// A gentle, deterministic winding-road function so the drive doesn't feel
// like a perfectly straight desert highway.
const curveAt = (worldDistance) =>
  32 * Math.sin(worldDistance / 145) + 14 * Math.sin(worldDistance / 46 + 1.2);

// Spawn pattern: a hand-tuned sequence of signs/obstacles spread along the drive.
// `lane` only matters for obstacle vehicles (which lane they occupy).
const PATTERN = [
  { gap: 90, type: 'speedLimit', value: 60 },
  { gap: 140, type: 'stop', lane: 1 },
  { gap: 150, type: 'pedestrian' },
  { gap: 140, type: 'speedLimit', value: 90 },
  { gap: 160, type: 'car', lane: 2 },
  { gap: 140, type: 'yield', lane: 1 },
  { gap: 150, type: 'speedLimit', value: 40 },
  { gap: 140, type: 'car', lane: 0 },
  { gap: 150, type: 'endOfLimit', value: 60 },
  { gap: 150, type: 'stop', lane: 1 },
  { gap: 140, type: 'pedestrian' },
  { gap: 150, type: 'speedLimit', value: 100 },
  { gap: 160, type: 'car', lane: 1 },
  { gap: 140, type: 'yield', lane: 1 },
  { gap: 150, type: 'speedLimit', value: 60 },
];

export const buildItems = (makeId) => {
  let cumulative = 150;
  return PATTERN.map((p) => {
    cumulative += p.gap;
    return {
      id: makeId('item'),
      type: p.type,
      value: p.value,
      lane: p.lane,
      triggerDistance: cumulative,
      evaluated: false,
      applied: false,
      collided: false,
      minSpeedSeen: Infinity,
    };
  });
};

export const TRACK_LENGTH = (() => {
  let cumulative = 150;
  PATTERN.forEach((p) => { cumulative += p.gap; });
  return cumulative + 60;
})();

// --- Depth helpers (chase / cockpit) ---------------------------------------

const depthParams = (worldDistanceOfPoint, cameraDistance) => {
  const d = worldDistanceOfPoint - cameraDistance;
  const t = Math.min(1, Math.max(0, 1 - d / VIEW_DISTANCE));
  const tw = t ** 1.5; // eased factor for width/curve so it compresses like real perspective
  return { d, t, tw };
};

const roadHalfWidthAt = (tw) => (ROAD_MAX_WIDTH / 2) * (0.04 + 0.96 * tw);
const centerXAt = (worldDistanceOfPoint, tw) => CANVAS_W / 2 + curveAt(worldDistanceOfPoint) * tw;
const iconScaleAt = (t) => 0.62 + 0.5 * t; // higher floor so far-away signs stay legible

// --- Public entry point -----------------------------------------------------

export const drawScene = (ctx, { carX, distance, items, now = 0, camera = 'chase' }) => {
  ctx.save();
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (camera === 'top') {
    drawTopDown(ctx, { carX, distance, items, now });
  } else {
    drawSky(ctx, distance);
    drawRoad(ctx, distance);
    drawScenery(ctx, distance);
    drawPerspectiveItems(ctx, { distance, items, now });

    if (camera === 'chase') {
      const playerCurve = curveAt(distance);
      drawPlayerCarChase(ctx, carX + playerCurve, CANVAS_H - 62);
    } else {
      drawCockpit(ctx);
    }
  }

  ctx.restore();
};

const drawPerspectiveItems = (ctx, { distance, items, now }) => {
  const withDepth = items
    .map((item) => ({ item, ...depthParams(item.triggerDistance, distance) }))
    .filter(({ d }) => d > -18 && d < VIEW_DISTANCE + 15)
    .sort((a, b) => a.t - b.t); // farther (smaller t) painted first

  withDepth.forEach(({ item, t, tw }) => {
    const y = HORIZON_Y + (CANVAS_H - HORIZON_Y) * t;
    const halfWidth = roadHalfWidthAt(tw);
    const cx = centerXAt(item.triggerDistance, tw);
    const scale = iconScaleAt(t);

    if (item.type === 'pedestrian') {
      ctx.fillStyle = COLORS.white;
      const stripeCount = 5;
      const bandH = Math.max(3, 22 * scale);
      for (let i = 0; i < stripeCount; i++) {
        const sw = (halfWidth * 2) / stripeCount;
        ctx.fillRect(cx - halfWidth + i * sw + sw * 0.15, y - bandH / 2, sw * 0.7, bandH);
      }
      drawSignAt(ctx, 'pedestrian', null, cx + halfWidth + 28 * scale, y, scale, now, isActiveZone(item, distance));
      return;
    }

    if (item.type === 'car') {
      const laneOffset = (item.lane - 1) * ((halfWidth * 2) / LANES);
      drawObstacleCar(ctx, cx + laneOffset, y, scale);
      return;
    }

    drawSignAt(ctx, item.type, item.value, cx + halfWidth + 28 * scale, y, scale, now, isActiveZone(item, distance));
  });
};

const isActiveZone = (item, distance) => {
  if (item.type === 'speedLimit' || item.type === 'endOfLimit') {
    return !item.applied && distance >= item.triggerDistance - 45;
  }
  if (['stop', 'yield', 'pedestrian'].includes(item.type)) {
    const before = item.type === 'stop' ? 25 : item.type === 'yield' ? 18 : 16;
    return !item.evaluated && distance >= item.triggerDistance - before - 15 && distance <= item.triggerDistance + 4;
  }
  return false;
};

const drawSky = (ctx, distance) => {
  const grad = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
  grad.addColorStop(0, COLORS.skyTop);
  grad.addColorStop(1, COLORS.skyHorizon);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, HORIZON_Y);

  ctx.fillStyle = COLORS.sun;
  ctx.beginPath();
  ctx.arc(CANVAS_W * 0.76, HORIZON_Y * 0.62, 26, 0, Math.PI * 2);
  ctx.fill();

  const parallax = (distance * 0.02) % CANVAS_W;
  ctx.fillStyle = COLORS.mountainFar;
  drawMountainRange(ctx, -parallax, HORIZON_Y - 4, 0.55);
  drawMountainRange(ctx, -parallax + CANVAS_W, HORIZON_Y - 4, 0.55);
  ctx.fillStyle = COLORS.mountain;
  drawMountainRange(ctx, -((parallax * 1.6) % CANVAS_W), HORIZON_Y, 0.85);
  drawMountainRange(ctx, -((parallax * 1.6) % CANVAS_W) + CANVAS_W, HORIZON_Y, 0.85);
};

const drawMountainRange = (ctx, xOffset, baseY, heightFactor) => {
  const peaks = [0, 0.18, 0.3, 0.48, 0.62, 0.8, 1];
  ctx.beginPath();
  ctx.moveTo(xOffset, baseY);
  peaks.forEach((p, i) => {
    const x = xOffset + p * CANVAS_W;
    const h = (18 + (i % 3) * 14) * heightFactor;
    ctx.lineTo(x, baseY - h);
  });
  ctx.lineTo(xOffset + CANVAS_W, baseY);
  ctx.closePath();
  ctx.fill();
};

const drawRoad = (ctx, distance) => {
  const step = 4;
  const dashPeriod = 26;
  for (let y = HORIZON_Y; y < CANVAS_H; y += step) {
    const t = (y - HORIZON_Y) / (CANVAS_H - HORIZON_Y);
    const tw = t ** 1.5;
    const halfWidth = roadHalfWidthAt(tw);
    const phase = distance + (1 - t) * VIEW_DISTANCE;
    const cx = CANVAS_W / 2 + curveAt(phase) * tw;

    ctx.fillStyle = Math.floor(phase / 18) % 2 === 0 ? COLORS.shoulder : COLORS.shoulderDark;
    ctx.fillRect(0, y, CANVAS_W, step + 1);

    ctx.fillStyle = Math.floor(phase / 22) % 2 === 0 ? COLORS.roadA : COLORS.roadB;
    ctx.fillRect(cx - halfWidth, y, halfWidth * 2, step + 1);

    ctx.fillStyle = COLORS.edge;
    const edgeW = Math.max(1, 2.4 * tw);
    ctx.fillRect(cx - halfWidth - edgeW / 2, y, edgeW, step + 1);
    ctx.fillRect(cx + halfWidth - edgeW / 2, y, edgeW, step + 1);

    const dashOn = Math.floor(phase / dashPeriod) % 2 === 0;
    if (dashOn) {
      ctx.fillStyle = COLORS.dash;
      const dashW = Math.max(1, 2 * tw);
      for (let lane = 1; lane < LANES; lane++) {
        const x = cx - halfWidth + lane * ((halfWidth * 2) / LANES);
        ctx.fillRect(x - dashW / 2, y, dashW, step + 1);
      }
    }
  }
};

const PALM_SPACING = 55;
const drawScenery = (ctx, distance) => {
  const startIndex = Math.floor((distance - 20) / PALM_SPACING);
  const endIndex = Math.floor((distance + VIEW_DISTANCE) / PALM_SPACING);
  for (let i = startIndex; i <= endIndex; i++) {
    const worldPos = i * PALM_SPACING;
    const { d, t, tw } = depthParams(worldPos, distance);
    if (d < -15 || t <= 0) continue;
    const y = HORIZON_Y + (CANVAS_H - HORIZON_Y) * t;
    const halfWidth = roadHalfWidthAt(tw);
    const cx = centerXAt(worldPos, tw);
    const side = i % 2 === 0 ? 1 : -1;
    const x = cx + side * (halfWidth + 42 * (0.4 + 0.6 * t));
    drawPalm(ctx, x, y, 0.35 + 0.65 * t);
  }
};

const drawPalm = (ctx, x, y, scale) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(0, 4, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = COLORS.palmTrunk;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 2); ctx.quadraticCurveTo(3, -22, 0, -46);
  ctx.stroke();
  ctx.fillStyle = COLORS.palmLeaf;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 14, -46 + Math.sin(a) * 8, 15, 5, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

// --- Signs: bigger, haloed, and pulsing while still unresolved -------------

const drawSignAt = (ctx, type, value, x, y, scale, now, active) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(Math.max(0.42, scale), Math.max(0.42, scale));

  ctx.strokeStyle = '#9a9a8f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 26); ctx.lineTo(0, 58);
  ctx.stroke();

  const r = 27;

  if (active) {
    const pulse = 0.55 + 0.45 * Math.sin(now / 180);
    ctx.beginPath();
    ctx.arc(0, 0, r + 11 + pulse * 4, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 209, 60, ${0.55 + 0.35 * pulse})`;
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, r + 7, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fill();

  drawSignIcon(ctx, type, value, r);
  ctx.restore();
};

const drawSignIcon = (ctx, type, value, r) => {
  if (type === 'stop') {
    ctx.fillStyle = COLORS.stopRed;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i - Math.PI / 8;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('STOP', 0, 4.5);
  } else if (type === 'yield') {
    ctx.fillStyle = COLORS.white;
    ctx.strokeStyle = COLORS.stopRed;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, -r); ctx.lineTo(r, r); ctx.lineTo(-r, r); ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else if (type === 'pedestrian') {
    ctx.fillStyle = COLORS.white;
    ctx.strokeStyle = COLORS.stopRed;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, -r); ctx.lineTo(r, r); ctx.lineTo(-r, r); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = COLORS.ink;
    ctx.beginPath(); ctx.arc(0, -3, 4.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-4.2, 2.5, 8.4, 12);
  } else if (type === 'speedLimit') {
    ctx.fillStyle = COLORS.white;
    ctx.strokeStyle = COLORS.stopRed;
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 17px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(value), 0, 6);
  } else if (type === 'endOfLimit') {
    ctx.fillStyle = COLORS.white;
    ctx.strokeStyle = COLORS.gray;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#555';
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(value), 0, 5);
    ctx.beginPath(); ctx.moveTo(-16, 13); ctx.lineTo(16, -13); ctx.stroke();
  }
};

// --- Cars: Dacia-esque hatchback silhouette --------------------------------
// A boxy, practical body with a wide greenhouse, visible wheel arches, a
// two-tone rear bumper and simple rectangular tail lights — reminiscent of
// the Dacia Logan/Sandero fleets many Moroccan driving schools actually use.

const drawDaciaBody = (ctx, { width, height, roofInset, bumperH }) => {
  const w = width;
  const h = height;
  ctx.fillStyle = COLORS.carTrim;
  roundRect(ctx, -w / 2, h / 2 - bumperH, w, bumperH, 6);
  ctx.fill();

  ctx.fillStyle = COLORS.carBody;
  ctx.beginPath();
  ctx.moveTo(-w / 2 + roofInset, -h / 2);
  ctx.lineTo(w / 2 - roofInset, -h / 2);
  ctx.lineTo(w / 2, h / 2 - bumperH);
  ctx.lineTo(-w / 2, h / 2 - bumperH);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.carBodyShade;
  ctx.fillRect(-w / 2 + roofInset, -h / 2, w - roofInset * 2, h * 0.08);

  ctx.fillStyle = COLORS.wheel;
  ctx.beginPath(); ctx.arc(-w / 2 + 4, h / 2 - bumperH - 2, w * 0.13, 0, Math.PI, false); ctx.fill();
  ctx.beginPath(); ctx.arc(w / 2 - 4, h / 2 - bumperH - 2, w * 0.13, 0, Math.PI, false); ctx.fill();
};

const drawPlayerCarChase = (ctx, x, y) => {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(0, 46, 36, 9, 0, 0, Math.PI * 2); ctx.fill();

  drawDaciaBody(ctx, { width: 64, height: 96, roofInset: 6, bumperH: 14 });

  ctx.fillStyle = COLORS.carWindow;
  ctx.beginPath();
  ctx.moveTo(-20, -38); ctx.lineTo(20, -38); ctx.lineTo(24, -12); ctx.lineTo(-24, -12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = COLORS.carWindowShine;
  ctx.beginPath();
  ctx.moveTo(-16, -35); ctx.lineTo(-4, -35); ctx.lineTo(-8, -16); ctx.lineTo(-20, -16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.carTrim;
  ctx.beginPath(); ctx.arc(0, -2, 3, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = COLORS.carLightRed;
  roundRect(ctx, -30, 26, 10, 9, 2); ctx.fill();
  roundRect(ctx, 20, 26, 10, 9, 2); ctx.fill();
  ctx.fillStyle = COLORS.carLight;
  roundRect(ctx, -18, 26, 8, 9, 2); ctx.fill();
  roundRect(ctx, 10, 26, 8, 9, 2); ctx.fill();

  ctx.fillStyle = COLORS.white;
  roundRect(ctx, -13, 34, 26, 9, 1.5); ctx.fill();
  ctx.strokeStyle = COLORS.carTrim;
  ctx.lineWidth = 1;
  roundRect(ctx, -13, 34, 26, 9, 1.5); ctx.stroke();

  ctx.restore();
};

const drawObstacleCar = (ctx, x, y, scale) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(Math.max(0.3, scale), Math.max(0.3, scale));

  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath(); ctx.ellipse(0, 36, 28, 8, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = COLORS.obstacle;
  roundRect(ctx, -26, -34, 52, 70, 8);
  ctx.fill();
  ctx.fillStyle = COLORS.carTrim;
  roundRect(ctx, -26, 24, 52, 12, 6);
  ctx.fill();
  ctx.fillStyle = COLORS.obstacleWindow;
  ctx.beginPath();
  ctx.moveTo(-16, -26); ctx.lineTo(16, -26); ctx.lineTo(19, -8); ctx.lineTo(-19, -8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = COLORS.wheel;
  ctx.beginPath(); ctx.arc(-24, 24, 8, 0, Math.PI, false); ctx.fill();
  ctx.beginPath(); ctx.arc(24, 24, 8, 0, Math.PI, false); ctx.fill();
  ctx.fillStyle = COLORS.carLight;
  roundRect(ctx, -22, 20, 9, 7, 2); ctx.fill();
  roundRect(ctx, 13, 20, 9, 7, 2); ctx.fill();

  ctx.restore();
};

// --- Cockpit / driver's-seat overlay ---------------------------------------

const drawCockpit = (ctx) => {
  ctx.save();

  ctx.fillStyle = 'rgba(20,22,20,0.55)';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, 0); ctx.lineTo(6, CANVAS_H * 0.5); ctx.lineTo(0, CANVAS_H * 0.5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(CANVAS_W, 0); ctx.lineTo(CANVAS_W - 26, 0); ctx.lineTo(CANVAS_W - 6, CANVAS_H * 0.5); ctx.lineTo(CANVAS_W, CANVAS_H * 0.5); ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#20211f';
  roundRect(ctx, CANVAS_W / 2 - 26, 6, 52, 14, 6);
  ctx.fill();
  ctx.fillStyle = '#4d5a56';
  roundRect(ctx, CANVAS_W / 2 - 22, 8, 44, 9, 4);
  ctx.fill();

  const dashTop = CANVAS_H - 108;
  const grad = ctx.createLinearGradient(0, dashTop, 0, CANVAS_H);
  grad.addColorStop(0, COLORS.dash2);
  grad.addColorStop(1, COLORS.dash1);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_H);
  ctx.lineTo(0, dashTop + 30);
  ctx.quadraticCurveTo(CANVAS_W / 2, dashTop, CANVAS_W, dashTop + 30);
  ctx.lineTo(CANVAS_W, CANVAS_H);
  ctx.closePath();
  ctx.fill();

  const wheelX = CANVAS_W / 2 - 62;
  const wheelY = CANVAS_H - 26;
  const wheelR = 54;
  ctx.save();
  ctx.translate(wheelX, wheelY);
  ctx.beginPath();
  ctx.ellipse(0, 0, wheelR, wheelR * 0.62, 0, Math.PI, Math.PI * 2);
  ctx.strokeStyle = COLORS.wheel;
  ctx.lineWidth = 12;
  ctx.stroke();
  ctx.strokeStyle = COLORS.wheel;
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, -wheelR * 0.55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(-wheelR * 0.8, -wheelR * 0.1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(wheelR * 0.8, -wheelR * 0.1); ctx.stroke();
  ctx.fillStyle = COLORS.wheelHub;
  ctx.beginPath(); ctx.arc(0, -2, 10, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.arc(wheelX, wheelY - 40, 22, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
};

// --- Top-down camera --------------------------------------------------------

const drawTopDown = (ctx, { carX, distance, items, now }) => {
  ctx.fillStyle = '#c9a66b';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const roadX = CANVAS_W / 2 - TOP_ROAD_WIDTH / 2;
  ctx.fillStyle = '#33352f';
  ctx.fillRect(roadX, 0, TOP_ROAD_WIDTH, CANVAS_H);

  ctx.strokeStyle = COLORS.edge;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(roadX, 0); ctx.lineTo(roadX, CANVAS_H);
  ctx.moveTo(roadX + TOP_ROAD_WIDTH, 0); ctx.lineTo(roadX + TOP_ROAD_WIDTH, CANVAS_H);
  ctx.stroke();

  const dashPeriod = 30;
  const offset = (distance * TOP_SCALE) % dashPeriod;
  ctx.strokeStyle = COLORS.dash;
  ctx.lineWidth = 2.5;
  for (let lane = 1; lane < LANES; lane++) {
    const x = roadX + lane * (TOP_ROAD_WIDTH / LANES);
    ctx.beginPath();
    for (let y = -dashPeriod + offset; y < CANVAS_H; y += dashPeriod) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + dashPeriod / 2);
    }
    ctx.stroke();
  }

  const carY = CANVAS_H - 90;
  const topLaneX = (lane) => roadX + (lane + 0.5) * (TOP_ROAD_WIDTH / LANES);

  items.forEach((item) => {
    const y = carY - (item.triggerDistance - distance) * TOP_SCALE;
    if (y < -70 || y > CANVAS_H + 70) return;

    if (item.type === 'pedestrian') {
      ctx.fillStyle = COLORS.white;
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(roadX + i * (TOP_ROAD_WIDTH / 5) + 4, y - 14, TOP_ROAD_WIDTH / 5 - 8, 28);
      }
      drawSignAt(ctx, 'pedestrian', null, roadX - 30, y, 0.7, now, isActiveZone(item, distance));
      return;
    }
    if (item.type === 'car') {
      drawObstacleCarTop(ctx, topLaneX(item.lane), y);
      return;
    }
    drawSignAt(ctx, item.type, item.value, roadX - 30, y, 0.7, now, isActiveZone(item, distance));
  });

  drawPlayerCarTop(ctx, carX, carY);
};

const drawObstacleCarTop = (ctx, x, y) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  roundRect(ctx, -18, -30, 36, 62, 8); ctx.fill();
  ctx.fillStyle = COLORS.obstacle;
  roundRect(ctx, -16, -32, 32, 62, 8); ctx.fill();
  ctx.fillStyle = COLORS.obstacleWindow;
  roundRect(ctx, -11, -22, 22, 16, 4); ctx.fill();
  roundRect(ctx, -11, 6, 22, 16, 4); ctx.fill();
  ctx.restore();
};

const drawPlayerCarTop = (ctx, x, y) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  roundRect(ctx, -20, -34, 40, 70, 9); ctx.fill();
  ctx.fillStyle = COLORS.carBody;
  roundRect(ctx, -18, -36, 36, 70, 9); ctx.fill();
  ctx.fillStyle = COLORS.carWindow;
  roundRect(ctx, -12, -26, 24, 18, 4); ctx.fill();
  roundRect(ctx, -12, 6, 24, 18, 4); ctx.fill();
  ctx.fillStyle = COLORS.wheel;
  roundRect(ctx, -20, -30, 4, 12, 2); ctx.fill();
  roundRect(ctx, 16, -30, 4, 12, 2); ctx.fill();
  roundRect(ctx, -20, 18, 4, 12, 2); ctx.fill();
  roundRect(ctx, 16, 18, 4, 12, 2); ctx.fill();
  ctx.fillStyle = COLORS.carLight;
  roundRect(ctx, -15, -35, 6, 4, 1.5); ctx.fill();
  roundRect(ctx, 9, -35, 6, 4, 1.5); ctx.fill();
  ctx.restore();
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
