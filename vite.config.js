import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // _build holds source captures and tooling; keep it out of the dev server's file watching.
  server: { watch: { ignored: ['**/_build/**'] } },
});
