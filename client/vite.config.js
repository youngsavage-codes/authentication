import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite automatically detects postcss.config.js, so no need to import it
export default defineConfig({
  plugins: [react()],
});
