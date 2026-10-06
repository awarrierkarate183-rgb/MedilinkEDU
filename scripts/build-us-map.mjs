import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const topology = JSON.parse(readFileSync(join(root, "public/maps/states-albers-10m.json"), "utf8"));

const ABBR = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

function decodeArc(index) {
  const reverse = index < 0;
  const raw = topology.arcs[reverse ? ~index : index];
  const { scale, translate } = topology.transform;
  let x = 0;
  let y = 0;
  const points = raw.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [Number((x * scale[0] + translate[0]).toFixed(1)), Number((y * scale[1] + translate[1]).toFixed(1))];
  });
  return reverse ? points.slice().reverse() : points;
}

function simplify(points) {
  if (points.length < 8) return points;
  const kept = [points[0]];
  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = kept[kept.length - 1];
    const curr = points[i];
    if (Math.hypot(curr[0] - prev[0], curr[1] - prev[1]) >= 1.6) kept.push(curr);
  }
  kept.push(points[points.length - 1]);
  return kept;
}

function ringPath(arcIndexes) {
  const points = [];
  for (const index of arcIndexes) {
    const decoded = decodeArc(index);
    if (points.length && decoded.length) decoded.shift();
    points.push(...decoded);
  }
  const simple = simplify(points);
  if (simple.length < 3) return "";
  return `M${simple.map((point) => point.join(",")).join("L")}Z`;
}

function geometryPath(geometry) {
  if (geometry.type === "Polygon") {
    return geometry.arcs.map(ringPath).filter(Boolean).join("");
  }
  return geometry.arcs
    .map((polygon) => polygon.map(ringPath).filter(Boolean).join(""))
    .filter(Boolean)
    .join("");
}

function centroid(path) {
  const pairs = [...path.matchAll(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g)].map((match) => [
    Number(match[1]),
    Number(match[2]),
  ]);
  if (!pairs.length) return { cx: 0, cy: 0 };
  const sum = pairs.reduce(
    (acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }),
    { x: 0, y: 0 },
  );
  return {
    cx: Number((sum.x / pairs.length).toFixed(1)),
    cy: Number((sum.y / pairs.length).toFixed(1)),
  };
}

const states = {};
for (const geometry of topology.objects.states.geometries) {
  const name = geometry.properties.name;
  const path = geometryPath(geometry);
  const { cx, cy } = centroid(path);
  states[name] = {
    abbr: ABBR[name] || name.slice(0, 2).toUpperCase(),
    path,
    cx,
    cy,
  };
}

const bbox = topology.bbox;
const width = Math.ceil(bbox[2] - bbox[0] + 8);
const height = Math.ceil(bbox[3] - bbox[1] + 8);
const ox = Number((-bbox[0] + 4).toFixed(1));
const oy = Number((-bbox[1] + 4).toFixed(1));

const file = `export const MAP_WIDTH = ${width};
export const MAP_HEIGHT = ${height};
export const MAP_OFFSET = { x: ${ox}, y: ${oy} };

export type StateShape = {
  abbr: string;
  path: string;
  cx: number;
  cy: number;
};

export const STATE_SHAPES: Record<string, StateShape> = ${JSON.stringify(states, null, 2)};
`;

writeFileSync(join(root, "lib/content/us-state-shapes.ts"), file);
unlinkSync(join(root, "public/maps/states-albers-10m.json"));
unlinkSync(join(root, "public/maps/us-states.svg"));
console.log(Object.keys(states).length, "states", width, "x", height);
