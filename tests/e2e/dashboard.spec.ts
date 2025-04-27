// tests/dashboard.spec.ts
import { test, expect } from './fixtures';
import { setupPartyApiMock } from '../../features/test-utils/apiMock';

test.describe('Performing a Party Search', () => {

    test.beforeEach(async ({ page, dashboardPage }) => {
        await dashboardPage.navigate();
    });

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


        test.describe('Clearing the search input and results', () => {

            test('should clear the input and search results when Clear button is clicked', async ({ dashboardPage }) => {
                await dashboardPage.partySearchInput.fill('Acme');
                await dashboardPage.partySearchButton.click();
        
                // Simulate results
                const resultsBeforeClear = await dashboardPage.getSearchResults();
                expect(resultsBeforeClear.length).toBeGreaterThan(0);
        
                await dashboardPage.clearSearchButton.click();
        
                // After clicking Clear:
                await expect(dashboardPage.partySearchInput).toHaveValue('');
                expect(await dashboardPage.getSearchResultsCount()).toBe(0);

            });
        
        });  

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

    test.describe('Filtering search results by Sanctions Status', () => {
  
        const allParties = [
          {
            'Party ID': 'P111',
            'Name': 'Alpha Corp',
            'Type': 'Organization',
            'Sanctions Status': 'Approved',
            'Match Score': 0.95,
          },
          {
            'Party ID': 'P222',
            'Name': 'Beta LLC',
            'Type': 'Organization',
            'Sanctions Status': 'Pending Review',
            'Match Score': 0.65,
          },
          {
            'Party ID': 'P333',
            'Name': 'Gamma Ltd',
            'Type': 'Organization',
            'Sanctions Status': 'Escalated',
            'Match Score': 0.85,
          }
        ];
      
        const approvedParties = [
          {
            'Party ID': 'P111',
            'Name': 'Alpha Corp',
            'Type': 'Organization',
            'Sanctions Status': 'Approved',
            'Match Score': 0.95,
          }
        ];
      
        const escalatedParties = [
          {
            'Party ID': 'P333',
            'Name': 'Gamma Ltd',
            'Type': 'Organization',
            'Sanctions Status': 'Escalated',
            'Match Score': 0.85,
          }
        ];
      
        test.beforeEach(async ({ page, dashboardPage }) => {
          await setupPartyApiMock(page, 'Acme', allParties); // Mock for initial "All" search
          await dashboardPage.navigate();
          await dashboardPage.searchParty('Acme');
        });
      
        test('should display all parties initially', async ({ dashboardPage }) => {
          const results = await dashboardPage.getSearchResults();
          expect(results.length).toBe(3);
        });
      
        test('should filter results by Approved status', async ({ page, dashboardPage }) => {
            await setupPartyApiMock(page, 'Acme', approvedParties, 'Approved');
      
          await Promise.all([
            page.waitForResponse(response => 
              response.url().includes('/api/parties') &&
              response.url().includes('sanctionsStatus=Approved')
            ),
            dashboardPage.selectSanctionsStatus('Approved')
          ]);
      
          const results = await dashboardPage.getSearchResults();
          expect(results).toEqual([
            expect.objectContaining({ 'Sanctions Status': 'Approved' })
          ]);
        });
      
        test('should filter results by Escalated status', async ({ page, dashboardPage }) => {
          await setupPartyApiMock(page, 'Acme', escalatedParties, 'Escalated');
      
          await Promise.all([
            page.waitForResponse(response => 
              response.url().includes('/api/parties') &&
              response.url().includes('sanctionsStatus=Escalated')
            ),
            dashboardPage.selectSanctionsStatus('Escalated')
          ]);
      
          const results = await dashboardPage.getSearchResults();
          expect(results).toEqual([
            expect.objectContaining({ 'Sanctions Status': 'Escalated' })
          ]);
        });
      
        test('should show all parties again when All is selected', async ({ page, dashboardPage }) => {
          await setupPartyApiMock(page, 'Acme', escalatedParties, 'Escalated');
      
          // First apply "Escalated" filter
          await Promise.all([
            page.waitForResponse(response => 
              response.url().includes('/api/parties') &&
              response.url().includes('sanctionsStatus=Escalated')
            ),
            dashboardPage.selectSanctionsStatus('Escalated')
          ]);
      
          // Now setup and select "All" again
          await setupPartyApiMock(page, 'Acme', allParties);
      
          await Promise.all([
            page.waitForResponse(response => 
              response.url().includes('/api/parties') && 
              !response.url().includes('sanctionsStatus=') // "All" means no filter param or empty
            ),
            dashboardPage.selectSanctionsStatus('All')
          ]);
      
          const results = await dashboardPage.getSearchResults();
          expect(results.length).toBe(3);
        });
      });
          
});
