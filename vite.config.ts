import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // when deploying to GitHub Pages under a repo named "market",
  // set the base to the repo name so assets are loaded correctly.
  base: '/market/',
  plugins: [react()],
})
