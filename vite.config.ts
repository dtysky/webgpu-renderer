import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl'

const config = defineConfig({
    plugins: [glsl(undefined, /\.(wgsl)$/i)],
})

export default config;