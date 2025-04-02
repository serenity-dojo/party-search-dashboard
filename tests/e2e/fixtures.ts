// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';

type MyFixtures = {
    dashboardPage: DashboardPage;
};

export const test = base.extend<MyFixtures>({
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },
});

export { expect } from '@playwright/test';
