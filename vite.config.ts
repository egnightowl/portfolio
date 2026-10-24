import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { parse } from 'yaml'

// Lets the app import the editable content/*.yml files.
const yamlContent = (): Plugin => ({
  name: 'yaml-content',
  transform(code, id) {
    if (!/\.ya?ml$/.test(id)) return null
    return { code: `export default ${JSON.stringify(parse(code))}`, map: null }
  },
})

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages address: https://egnightowl.github.io/portfolio/
  base: '/portfolio/',
  plugins: [react(), yamlContent()],
})
