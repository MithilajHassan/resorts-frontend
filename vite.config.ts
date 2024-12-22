import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': env
    },
  plugins: [react()],
  server:{
    port:5000,
    proxy:{
      '/api':{
        target:'https://luminova.fun',
        changeOrigin: true,
      }
    }
  }
}
})
