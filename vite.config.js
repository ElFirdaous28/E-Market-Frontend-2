import { defineConfig } from 'vite';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenvFlow from 'dotenv-flow';


dotenvFlow.config();

// https://vite.dev/config/
export default defineConfig({

  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "leet-initiative",
      project: "javascript-react",
    })
  ],
});
