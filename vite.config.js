import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

// https://vite.dev/config/
export default defineConfig(() => {
  console.log('VITE_ENV =', process.env.VITE_ENV);

  return {
    plugins: [react(), tailwindcss()],
  };
});