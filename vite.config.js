import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the initial JS payload small on budget Android phones: vendor chunks
    // are split so the 3D library never loads with the critical path.
    rollupOptions: {
      output: {
        // Function form so react-dom / router are reliably grouped with react.
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react';
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
