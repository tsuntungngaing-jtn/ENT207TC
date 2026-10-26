import { useMemo } from 'react'
import { boundsOf, project, type GeoBounds } from '../../sim/map/project'

type Ring = number[][]
type Position = [number, number]

export type MapFeatureProps = {
  name?: string
  kind?: string
  id?: string
  heat?: number
  [key: string]: unknown
}

export type MapGeometry =
  | { type: 'Point'; coordinates: number[] }
  | { type: 'Polygon'; coordinates: Ring[] }
  | { type: 'MultiPolygon'; coordinates: Ring[][] }

export type MapFeature = {
  type: 'Feature'
  properties?: MapFeatureProps | null
  geometry: MapGeometry
}

export type MapGeoJson = {
  type: 'FeatureCollection'
  features: MapFeature[]
}

type Props = {
  geojson: MapGeoJson
  showHeat: boolean
  showCompetitors: boolean
  showOd: boolean
  promoCorridor: number
  width?: number
  height?: number
}

function collectRings(features: MapFeature[]): Ring[] {
  const rings: Ring[] = []
  for (const f of features) {
    const g = f.geometry
    if (!g) continue
    if (g.type === 'Polygon') {
      rings.push(...g.coordinates)
    } else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates) rings.push(...poly)
    } else if (g.type === 'Point') {
      const [lng, lat] = g.coordinates
      rings.push([[lng, lat]])
    }
  }
  return rings
}

function ringCentroid(ring: Ring): Position {
  let sx = 0
  let sy = 0
  let n = 0
  for (const pt of ring) {
    if (pt.length < 2) continue
    sx += pt[0]
    sy += pt[1]
    n += 1
  }
  if (n === 0) return [0, 0]
  return [sx / n, sy / n]
}

function featureCentroid(f: MapFeature): Position | null {
  const g = f.geometry
  if (!g) return null
  if (g.type === 'Point') {
    return [g.coordinates[0], g.coordinates[1]]
  }
  if (g.type === 'Polygon') {
    return ringCentroid(g.coordinates[0] ?? [])
  }
  if (g.type === 'MultiPolygon') {
    const first = g.coordinates[0]?.[0]
    return first ? ringCentroid(first) : null
  }
  return null
}

function pathFromRing(ring: Ring, b: GeoBounds, w: number, h: number): string {
  return ring
    .map((pt, i) => {
      const { x, y } = project(pt[0], pt[1], b, w, h)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
    .concat(' Z')
}

export function SandboxMap({
  geojson,
  showHeat,
  showCompetitors,
  showOd,
  promoCorridor,
  width = 720,
  height = 420,
}: Props) {
  const features = geojson.features ?? []

  const bounds = useMemo(() => boundsOf(collectRings(features)), [geojson])

  const regions = features.filter(
    (f) =>
      (f.geometry?.type === 'Polygon' || f.geometry?.type === 'MultiPolygon') &&
      f.properties?.kind !== 'heat',
  )
  const points = features.filter((f) => f.geometry?.type === 'Point')
  const property = points.find((f) => f.properties?.kind === 'property')
  const competitors = points.filter((f) => f.properties?.kind === 'competitor')
  const heatFeatures = features.filter((f) => typeof f.properties?.heat === 'number')

  const propertyPt = property ? featureCentroid(property) : null

  const odLines = useMemo(() => {
    if (!showOd || !propertyPt) return [] as { from: Position; to: Position }[]
    const sources: Position[] = []
    for (const c of competitors.slice(0, 2)) {
      const pt = featureCentroid(c)
      if (pt) sources.push(pt)
    }
    if (sources.length < 3) {
      for (const r of regions) {
        if (sources.length >= 3) break
        const pt = featureCentroid(r)
        if (pt) sources.push(pt)
      }
    }
    return sources.slice(0, 3).map((from) => ({ from, to: propertyPt }))
  }, [showOd, propertyPt, competitors, regions])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full rounded-xl bg-slate-50 ring-1 ring-slate-200/80"
      role="img"
      aria-label="Tengchong operations sandbox map"
    >
      <defs>
        <linearGradient id="sim-map-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill="url(#sim-map-bg)" />

      {regions.map((f, i) => {
        const g = f.geometry
        const rings =
          g.type === 'Polygon'
            ? g.coordinates
            : g.type === 'MultiPolygon'
              ? g.coordinates.flat()
              : []
        const heat = typeof f.properties?.heat === 'number' ? f.properties.heat : null
        const opacity =
          showHeat && heat != null ? Math.min(0.85, Math.max(0.08, heat * promoCorridor * 0.55)) : 0.22
        const fill =
          showHeat && heat != null ? `rgba(13, 148, 136, ${opacity})` : 'rgba(148, 163, 184, 0.28)'
        return (
          <g key={`region-${f.properties?.id ?? f.properties?.name ?? i}`}>
            {rings.map((ring, ri) => (
              <path
                key={ri}
                d={pathFromRing(ring, bounds, width, height)}
                fill={fill}
                stroke="#64748b"
                strokeWidth={1.2}
              />
            ))}
            {f.properties?.name
              ? (() => {
                  const c = featureCentroid(f) ?? ([0, 0] as Position)
                  const p = project(c[0], c[1], bounds, width, height)
                  return (
                    <text
                      x={p.x}
                      y={p.y}
                      textAnchor="middle"
                      className="fill-slate-600 text-[10px] font-medium"
                      style={{ fontSize: 10 }}
                    >
                      {f.properties.name}
                    </text>
                  )
                })()
              : null}
          </g>
        )
      })}

      {showHeat
        ? heatFeatures.map((f, i) => {
            const heat = Number(f.properties?.heat ?? 0)
            const opacity = Math.min(0.9, Math.max(0.05, heat * promoCorridor * 0.6))
            const g = f.geometry
            if (g.type === 'Point') {
              const { x, y } = project(g.coordinates[0], g.coordinates[1], bounds, width, height)
              return (
                <circle
                  key={`heat-${i}`}
                  cx={x}
                  cy={y}
                  r={14 + heat * 10}
                  fill={`rgba(20, 184, 166, ${opacity})`}
                  stroke="none"
                />
              )
            }
            if (g.type === 'Polygon' || g.type === 'MultiPolygon') {
              const rings =
                g.type === 'Polygon' ? g.coordinates : g.coordinates.flat()
              return rings.map((ring, ri) => (
                <path
                  key={`heat-poly-${i}-${ri}`}
                  d={pathFromRing(ring, bounds, width, height)}
                  fill={`rgba(20, 184, 166, ${opacity})`}
                  stroke="none"
                />
              ))
            }
            return null
          })
        : null}

      {showOd
        ? odLines.map((line, i) => {
            const a = project(line.from[0], line.from[1], bounds, width, height)
            const b = project(line.to[0], line.to[1], bounds, width, height)
            return (
              <line
                key={`od-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#0d9488"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.75}
              />
            )
          })
        : null}

      {showCompetitors
        ? competitors.map((f, i) => {
            const pt = featureCentroid(f)
            if (!pt) return null
            const { x, y } = project(pt[0], pt[1], bounds, width, height)
            return (
              <g key={`comp-${f.properties?.id ?? i}`}>
                <circle cx={x} cy={y} r={5.5} fill="#64748b" stroke="#fff" strokeWidth={1.5} />
                {f.properties?.name ? (
                  <text
                    x={x + 8}
                    y={y + 3}
                    className="fill-slate-600"
                    style={{ fontSize: 9 }}
                  >
                    {f.properties.name}
                  </text>
                ) : null}
              </g>
            )
          })
        : null}

      {propertyPt ? (
        <g>
          <circle
            cx={project(propertyPt[0], propertyPt[1], bounds, width, height).x}
            cy={project(propertyPt[0], propertyPt[1], bounds, width, height).y}
            r={8}
            fill="#0d9488"
            stroke="#fff"
            strokeWidth={2}
          />
          <text
            x={project(propertyPt[0], propertyPt[1], bounds, width, height).x + 10}
            y={project(propertyPt[0], propertyPt[1], bounds, width, height).y + 4}
            className="fill-navy-900 font-semibold"
            style={{ fontSize: 11 }}
          >
            {property?.properties?.name ?? 'Property'}
          </text>
        </g>
      ) : null}
    </svg>
  )
}
