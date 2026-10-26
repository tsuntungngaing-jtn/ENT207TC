import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  plugins: [
    {
      name: 'geojson-loader',
      transform(src, id) {
        if (id.endsWith('.geojson')) {
          return `export default ${src}`
        }
      },
    },
  ],
})
