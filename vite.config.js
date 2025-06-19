import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

const isDev = process.env.NODE_ENV === 'development'

// https://vite.dev/config/
export default defineConfig({
    base: '/moxvault-basic/',
    plugins: [react(), tailwindcss()],
    server: isDev
        ? {
            https: {
                key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
                cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
            },
            host: true,
            port: 3000,
        } : undefined
})
