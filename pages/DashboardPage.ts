import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    // Define Locators as properties for easy reuse
    readonly partySearchInput: Locator;
    readonly partySearchButton: Locator;
    readonly searchResultsTable: Locator;
    readonly noResultsMessage: Locator;
    readonly partySuggestions: Locator;
    readonly clearSearchButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.partySearchInput = page.locator('[data-testid=party-search-input]');
        this.partySearchButton = page.locator('[data-testid=party-search-button]');
        this.searchResultsTable = page.locator('[data-testid=search-results-table]');
        this.noResultsMessage = page.locator('[data-testid=no-results-message]');
        this.partySuggestions = page.locator('[data-testid^=suggestion-]');
        this.clearSearchButton = page.locator('[data-testid=clear-search-button]');
    }

    async navigate() {
        // Sometimes the application may take a while to start, so we wait for the page to load.
        await this.page.goto('http://localhost:3000', { timeout: 30000 });
    }

    /**
     * Fills in the search input and clicks the search button.
     */
    async searchParty(searchString: string) {
        await this.partySearchInput.click();
        await this.partySearchInput.fill(searchString);
        await this.partySearchButton.click();
    }

    async waitForSuggestions() {
        await this.page.waitForSelector('[data-testid^="suggestion-"]', { timeout: 3000 });
    }

    async getSuggestions(): Promise<string[]> {
        const suggestionElements = await this.page.locator('[data-testid^="suggestion-"]').all();
        const suggestions = await Promise.all(suggestionElements.map(el => el.innerText()));
        return suggestions.map(text => text.trim());
    }


    getTitle(): Promise<string> {
        return this.page.title();
    }


    /**
     * Returns the number of rows in the search results table, or 0 if the table is not visible.
     */
    async getSearchResultsCount(): Promise<number> {
        if (await this.searchResultsTable.isVisible({ timeout: 500 })) {
            return await this.searchResultsTable.locator('tbody tr').count();
        }
        return 0;
    }

    async getSearchResults(): Promise<Array<Record<string, string>>> {
        // Wait for at least one row to appear (or handle the case of no results).
        await this.searchResultsTable.locator('tbody tr').first().waitFor({ state: 'visible' }).catch(() => { /* handle no rows */ });

        // Read the column headers from the table's <thead> (assuming it exists).
        const headerCells = this.searchResultsTable.locator('thead th');
        const headerCount = await headerCells.count();

        const headers: string[] = [];
        for (let i = 0; i < headerCount; i++) {
            headers.push((await headerCells.nth(i).innerText()).trim());
        }

        // Now read each row from <tbody>
        const rowLocator = this.searchResultsTable.locator('tbody tr');
        const rowCount = await rowLocator.count();

        const results: Array<Record<string, string>> = [];

        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const cellLocator = rowLocator.nth(rowIndex).locator('td');
            const cellCount = await cellLocator.count();
            const rowData: Record<string, string> = {};

            // For each cell, map it to the corresponding header
            for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
                const header = headers[cellIndex];
                const cellValue = (await cellLocator.nth(cellIndex).innerText()).trim();
                rowData[header] = cellValue;
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
