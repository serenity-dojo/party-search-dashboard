// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './tests',
    timeout: 30000,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        headless: true,
        actionTimeout: 0,
        baseURL: 'http://localhost:3000',
        ignoreHTTPSErrors: true,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
    webServer: {
        command: 'npm run start',
        port: 3000,
        timeout: 120000,
        reuseExistingServer: !process.env.CI,
    },
};

export default config;