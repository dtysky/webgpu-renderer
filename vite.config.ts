import {resolve} from 'path';
import {defineConfig} from 'vite';
import glsl from 'vite-plugin-glsl';

const config = defineConfig({
  base: './',
  server: {
    port: 8888,
  },
  build: {
    outDir: 'docs',
    assetsDir: '',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  plugins: [
    glsl(undefined, /\.(wgsl)$/i)
  ]
});

export default config;