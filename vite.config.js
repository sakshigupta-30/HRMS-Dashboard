import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // ✅ Keep this for React Router
    proxy: {
      '/api': {
        target: 'https://hrms-backend-50gj.onrender.com',
        changeOrigin: true,
        secure: true,
        timeout: 60000,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from:', req.url, 'Status:', proxyRes.statusCode);
          });
        }
      }
    }
  }
})