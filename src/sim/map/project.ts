export type GeoBounds = {
  minLng: number
  maxLng: number
  minLat: number
  maxLat: number
}

/** Bounds of polygon rings (GeoJSON Polygon `coordinates`). */
export function boundsOf(coords: number[][][]): GeoBounds {
  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  for (const ring of coords) {
    for (const pt of ring) {
      const lng = pt[0]
      const lat = pt[1]
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
  }

  if (!Number.isFinite(minLng)) {
    return { minLng: 0, maxLng: 1, minLat: 0, maxLat: 1 }
  }

  // Tiny pad so edge points are not clipped
  const padLng = (maxLng - minLng || 0.01) * 0.06
  const padLat = (maxLat - minLat || 0.01) * 0.06
  return {
    minLng: minLng - padLng,
    maxLng: maxLng + padLng,
    minLat: minLat - padLat,
    maxLat: maxLat + padLat,
  }
}

/** Linear lng/lat → SVG; Y flipped for screen coords. */
export function project(
  lng: number,
  lat: number,
  b: GeoBounds,
  width: number,
  height: number,
): { x: number; y: number } {
  const dx = b.maxLng - b.minLng || 1
  const dy = b.maxLat - b.minLat || 1
  const x = ((lng - b.minLng) / dx) * width
  const y = (1 - (lat - b.minLat) / dy) * height
  return { x, y }
}
