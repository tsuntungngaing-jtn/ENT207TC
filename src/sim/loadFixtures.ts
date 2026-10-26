import type { SimFixtures } from './types'
import property from './fixtures/property.json'
import calendar from './fixtures/calendar-baseline.json'
import competitors from './fixtures/competitors.json'
import channels from './fixtures/channels.json'
import mapGeoJsonData from './fixtures/tengchong.map.geojson'

export const mapGeoJson = mapGeoJsonData

export function loadFixtures(): SimFixtures {
  return {
    property,
    calendar,
    competitors,
    channels,
  }
}
