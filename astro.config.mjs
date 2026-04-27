import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

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
    integrations: [mdx()],
});
