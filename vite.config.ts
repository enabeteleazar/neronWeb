import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: '0.0.0.0',
    // Nécessaire depuis Vite 6 (protection anti DNS-rebinding) pour accepter
    // les requêtes arrivant via le reverse proxy Tailscale Serve (Host
    // header = homebox.tail7f8e60.ts.net), en plus de localhost/IP locales.
    allowedHosts: ['homebox.tail7f8e60.ts.net'],
  }
});
