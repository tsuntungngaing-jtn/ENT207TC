import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'geojson-loader',
      transform(src, id) {
        if (id.endsWith('.geojson')) {
          return `export default ${src}`
        }
      },
    },
  ],
  json: {
    namedExports: true,
  },
})
