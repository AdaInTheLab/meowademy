import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'http://localhost:4321',
    server: {
        host: '127.0.0.1',
        port: 4321,
    },
    vite: {
        server: {
            fs: { allow: ['..'] },
        },
    },
});
