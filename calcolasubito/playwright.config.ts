import { defineConfig } from '@playwright/test'

const PORT = 3200
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: true,
  },
})
