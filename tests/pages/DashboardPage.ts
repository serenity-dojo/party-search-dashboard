import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    // Define Locators as properties for easy reuse
    readonly partySearchInput: Locator;
    readonly partySearchButton: Locator;
    readonly searchResultsTable: Locator;
    readonly noResultsMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.partySearchInput = page.locator('[data-testid=party-search-input]');
        this.partySearchButton = page.locator('[data-testid=party-search-button]');
        this.searchResultsTable = page.locator('[data-testid=search-results-table]');
        this.noResultsMessage = page.locator('[data-testid=no-results-message]');
    }

    async navigate() {
        await this.page.goto('http://localhost:3000');
    }

    /**
     * Fills in the search input and clicks the search button.
     */
    async searchParty(searchString: string) {
        await this.partySearchInput.fill(searchString);
        await this.partySearchButton.click();
    }

    getTitle(): Promise<string> {
        return this.page.title();
    }

    /**
     * Returns the text of each cell in the results table as a 2D array,
     * where each sub-array is one row of cells.
     */
    async getSearchResults(): Promise<string[][]> {
        // Wait for at least one row to appear, if that’s expected
        await this.searchResultsTable.locator('tbody tr').first().waitFor({ state: 'visible' });

        // Count how many rows we have
        const rows = this.searchResultsTable.locator('tbody tr');
        const rowCount = await rows.count();

        const results: string[][] = [];
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i).locator('td');
            const cellCount = await row.count();
            const rowData: string[] = [];

            for (let j = 0; j < cellCount; j++) {
                rowData.push(await row.nth(j).innerText());
            }
            results.push(rowData);
        }

        return results;
    }

    /**
     * Returns the “No Results” message text (or null if it doesn’t exist).
     */
    async getNoResultsMessage(): Promise<string | null> {
        return this.noResultsMessage.textContent();
    }
}
