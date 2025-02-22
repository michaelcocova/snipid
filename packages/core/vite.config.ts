import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    outDir: '../snipid/dist',
    emptyOutDir: true,
    lib: {
      entry: './src/index.ts',
      name: 'SnipID',
      fileName: 'snipid',
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          snipid: 'SnipID',
        },
      },
    },
  },
})
