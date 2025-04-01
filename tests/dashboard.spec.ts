// tests/dashboard.spec.ts
import { test, expect } from './fixtures';
import { setupPartyApiMock } from '../features/test-utils/apiMock';

test.describe('Performing a Party Search', () => {
    test.beforeEach(async ({ dashboardPage }) => {
        await dashboardPage.navigate();
    }
    );

    test.describe('Viewing the Dashboard Page', () => {

        test('should display the correct title', async ({ dashboardPage }) => {
            const title = await dashboardPage.getTitle();
            expect(title).toBe('Sanctions Dashboard');
        });

        test('should display the search party input and button', async ({ dashboardPage }) => {

            await expect(dashboardPage.partySearchInput).toBeVisible();
            await expect(dashboardPage.partySearchButton).toBeVisible();
        }
        );

        test('search button should be only enabled when text is entered in the search input', async ({ dashboardPage }) => {
            await dashboardPage.partySearchInput.fill('Acme');
            await expect(dashboardPage.partySearchInput).toBeVisible();
            await expect(dashboardPage.partySearchButton).toBeEnabled();
        }
        );
    });


    test.describe('when the Party API returns results', () => {

        const matchingParties = [
            {
                'Party ID': 'P12345678',
                'Name': 'Acme Corporation',
                'Type': 'Organization',
                'Sanctions Status': 'Approved',
                'Match Score': '95%',
            },
            {
                'Party ID': 'P87654321',
                'Name': 'Acme Inc.',
                'Type': 'Organization',
                'Sanctions Status': 'Pending Review',
                'Match Score': '65%',
            },
        ]

        test.beforeEach(async ({ page, dashboardPage }) => {
            // Set up the mock so that searching for "Acme" returns a couple of records.
            await setupPartyApiMock(page, 'Acme', matchingParties);
        });

        test('should display the sanctioned parties when a match is found', async ({ dashboardPage }) => {

            await dashboardPage.searchParty('Acme');

            const results = await dashboardPage.getSearchResults();

            expect(results).toEqual(matchingParties);
        }
        );
    }
    );
    test.describe('when the Party API returns no results', () => {
        test.beforeEach(async ({ page, dashboardPage }) => {
            // Set up the mock so that searching for "Acme" returns no records.
            await setupPartyApiMock(page, 'Acme', []);
        });

        test('should display a message indicating no results were found', async ({ dashboardPage }) => {
            await dashboardPage.searchParty('Acme');
            const message = await dashboardPage.noResultsMessage.textContent();
            expect(message).toBe("No parties found matching 'Acme'");
        }
        );
    }
    );
});
