// tests/dashboard.spec.ts
import { test, expect } from './fixtures';
import { setupPartyApiMock } from '../../features/test-utils/apiMock';

test.describe('Performing a Party Search', () => {

    test.beforeEach(async ({ page, dashboardPage }) => {
        await dashboardPage.navigate();
    });

    test.describe('Viewing the Dashboard Page', () => {

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
                'Match Score': 0.95,
            },
            {
                'Party ID': 'P87654321',
                'Name': 'Acme Inc.',
                'Type': 'Organization',
                'Sanctions Status': 'Pending Review',
                'Match Score': 0.65,
            },
        ]

        const displayedParties = [
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
            await dashboardPage.navigate();
        });
    
        test('should display the sanctioned parties when a match is found', async ({ dashboardPage }) => {

            await dashboardPage.searchParty('Acme');

            const results = await dashboardPage.getSearchResults();

            expect(results).toEqual(displayedParties);
        }
        );
    }
    );

    test.describe('when the Party API returns no results', () => {
        test.beforeEach(async ({ page, dashboardPage }) => {
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

    test.describe('when the analyst starts to type in the search input', () => {
        
        const matchingParties = [
            {
                'Party ID': 'P13579246',
                'Name': 'John Smith',
                'Type': 'Individual',
                'Sanctions Status': 'Pending Review',
                'Match Score': 0.85,
            },
            {
                'Party ID': 'P24681357',
                'Name': 'Smith and Sons',
                'Type': 'Organization',
                'Sanctions Status': 'Pending Review',
                'Match Score': 0.65,
            }
        ]

        test.beforeEach(async ({ page, dashboardPage }) => {
            await setupPartyApiMock(page, 'Smi', matchingParties);
        });

        test('should display no suggestions when two characters are entered', async ({ dashboardPage }) => {
            await dashboardPage.partySearchInput.fill('Sm');
            const suggestions = await dashboardPage.getSuggestions();
            expect(suggestions.length).toBe(0);
        });

        test('should display suggestions when three characters are entered', async ({ dashboardPage }) => {
            await dashboardPage.partySearchInput.fill('Smi');

            await dashboardPage.partySuggestions.first().waitFor({ state: 'visible' });

            const suggestions = await dashboardPage.getSuggestions();
        
            expect(suggestions).toEqual(expect.arrayContaining([
                'John Smith',
                'Smith and Sons'
            ]));
        });

    });
});
