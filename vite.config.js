import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // @import, lighten and darken are retained to demonstrate the assignment's SCSS features.
  css: { preprocessorOptions: { scss: { silenceDeprecations: ['import', 'global-builtin', 'color-functions'] } } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/')) return 'mui';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
