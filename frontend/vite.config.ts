import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  if (process.env.VERCEL === '1') {
    const apiOrigin = (process.env.VITE_API_URL || loadEnv(mode, process.cwd()).VITE_API_URL || '').trim();
    let valid = false;
    try {
      const url = new URL(apiOrigin);
      valid = url.protocol === 'https:' && url.pathname === '/' && !url.search && !url.hash
        && !url.username && !url.password && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    } catch { /* Show one actionable configuration error below. */ }
    if (!valid) throw new Error('Set VITE_API_URL in Vercel to the public HTTPS backend origin (without /api), then redeploy.');
  }
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': import.meta.dirname,
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
