/** Geographic centers of U.S. states. Used to place chapter pins by recorded state, not a street address. */
export const STATE_CENTERS: Record<string, { lat: number; lng: number }> = {
  Alabama: { lat: 32.81, lng: -86.79 },
  Alaska: { lat: 64.07, lng: -152.28 },
  Arizona: { lat: 34.27, lng: -111.66 },
  Arkansas: { lat: 34.97, lng: -92.37 },
  California: { lat: 37.18, lng: -119.47 },
  Colorado: { lat: 39.0, lng: -105.55 },
  Connecticut: { lat: 41.58, lng: -72.76 },
  Delaware: { lat: 38.99, lng: -75.51 },
  "District of Columbia": { lat: 38.91, lng: -77.04 },
  Florida: { lat: 28.63, lng: -82.45 },
  Georgia: { lat: 32.68, lng: -83.22 },
  Hawaii: { lat: 20.29, lng: -156.37 },
  Idaho: { lat: 44.35, lng: -114.61 },
  Illinois: { lat: 40.04, lng: -89.2 },
  Indiana: { lat: 39.85, lng: -86.26 },
  Iowa: { lat: 42.08, lng: -93.5 },
  Kansas: { lat: 38.5, lng: -98.38 },
  Kentucky: { lat: 37.53, lng: -85.3 },
  Louisiana: { lat: 31.17, lng: -91.87 },
  Maine: { lat: 45.37, lng: -69.24 },
  Maryland: { lat: 39.06, lng: -76.8 },
  Massachusetts: { lat: 42.26, lng: -71.81 },
  Michigan: { lat: 44.35, lng: -85.41 },
  Minnesota: { lat: 46.28, lng: -94.31 },
  Mississippi: { lat: 32.74, lng: -89.68 },
  Missouri: { lat: 38.46, lng: -92.29 },
  Montana: { lat: 47.05, lng: -109.63 },
  Nebraska: { lat: 41.54, lng: -99.8 },
  Nevada: { lat: 39.33, lng: -116.63 },
  "New Hampshire": { lat: 43.68, lng: -71.58 },
  "New Jersey": { lat: 40.3, lng: -74.52 },
  "New Mexico": { lat: 34.31, lng: -106.02 },
  "New York": { lat: 42.95, lng: -75.53 },
  "North Carolina": { lat: 35.56, lng: -79.39 },
  "North Dakota": { lat: 47.45, lng: -100.47 },
  Ohio: { lat: 40.29, lng: -82.79 },
  Oklahoma: { lat: 35.59, lng: -97.51 },
  Oregon: { lat: 43.93, lng: -120.56 },
  Pennsylvania: { lat: 40.88, lng: -77.8 },
  "Rhode Island": { lat: 41.68, lng: -71.51 },
  "South Carolina": { lat: 33.86, lng: -80.72 },
  "South Dakota": { lat: 44.3, lng: -99.44 },
  Tennessee: { lat: 35.75, lng: -86.39 },
  Texas: { lat: 31.48, lng: -99.33 },
  Utah: { lat: 39.31, lng: -111.67 },
  Vermont: { lat: 44.07, lng: -72.66 },
  Virginia: { lat: 37.52, lng: -78.85 },
  Washington: { lat: 47.38, lng: -120.45 },
  "West Virginia": { lat: 38.6, lng: -80.62 },
  Wisconsin: { lat: 44.27, lng: -89.62 },
  Wyoming: { lat: 43.0, lng: -107.55 },
};

export const MAP_WIDTH = 360;
export const MAP_HEIGHT = 230;

export function stateCenter(state: string | null | undefined) {
  if (!state) return null;
  return STATE_CENTERS[state] || null;
}

export function projectState(lat: number, lng: number) {
  const minLng = -125;
  const maxLng = -66;
  const minLat = 24;
  const maxLat = 50;
  const pad = 22;
  const x = ((lng - minLng) / (maxLng - minLng)) * (MAP_WIDTH - pad * 2) + pad;
  const y = ((maxLat - lat) / (maxLat - minLat)) * (MAP_HEIGHT - pad * 2) + pad;
  return {
    x: Math.max(14, Math.min(MAP_WIDTH - 14, x)),
    y: Math.max(14, Math.min(MAP_HEIGHT - 14, y)),
  };
}

export function chapterPin(state: string | null | undefined, indexInState: number, stateCount: number) {
  const center = stateCenter(state);
  if (!center) return null;
  const point = projectState(center.lat, center.lng);
  if (stateCount <= 1) return point;
  const angle = (indexInState / stateCount) * Math.PI * 2 - Math.PI / 2;
  const radius = 16;
  return {
    x: point.x + Math.cos(angle) * radius,
    y: point.y + Math.sin(angle) * radius,
  };
}
