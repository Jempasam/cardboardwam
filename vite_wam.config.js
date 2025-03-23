import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps:{
        esbuildOptions:{
            target: 'es2022'
        }
    },
    build: {
        target: "es2022",
        outDir: 'dist',
        lib:{
            entry: {
                'index': 'src/CardboardWAM.ts'
            },
            name: 'index',
            formats: ['es'],
        }
    },
    base: './',
});