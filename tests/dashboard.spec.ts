// tests/dashboard.spec.ts
import { test, expect } from './fixtures';

test.describe('Dashboard Page', () => {
    test.beforeEach(async ({ dashboardPage }) => {
        await dashboardPage.navigate();
    }
    );

    test('should display the correct title', async ({ dashboardPage }) => {
        const title = await dashboardPage.getTitle();
        expect(title).toBe('Sanctions Dashboard');
    });

    test('should display the search party input and button', async ({ dashboardPage }) => {

        await expect(dashboardPage.partySearchInput).toBeVisible();
        await expect(dashboardPage.partySearchInput).toBeEnabled();

        await expect(dashboardPage.partySearchButton).toBeVisible();
        await expect(dashboardPage.partySearchButton).toBeEnabled();
    }
    );
});

