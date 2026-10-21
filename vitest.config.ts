import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['backup_pre_v3/**', 'node_modules/**'],
    setupFiles: ['./tests/setup.ts'],
  },
});
