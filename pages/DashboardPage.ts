import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    // Define Locators as properties for easy reuse
    readonly partySearchInput: Locator;
    readonly partySearchButton: Locator;
    readonly searchResultsTable: Locator;
    readonly noResultsMessage: Locator;
    readonly partySuggestions: Locator;

    constructor(page: Page) {
        this.page = page;
        this.partySearchInput = page.locator('[data-testid=party-search-input]');
        this.partySearchButton = page.locator('[data-testid=party-search-button]');
        this.searchResultsTable = page.locator('[data-testid=search-results-table]');
        this.noResultsMessage = page.locator('[data-testid=no-results-message]');
        this.partySuggestions = page.locator('[data-testid^=suggestion-]');}

    async navigate() {
        await this.page.goto('http://localhost:3000', { timeout: 10000, waitUntil: 'domcontentloaded' });
    }

    /**
     * Fills in the search input and clicks the search button.
     */
    async searchParty(searchString: string) {
        await this.partySearchInput.click();
        await this.partySearchInput.fill(searchString);
        await this.partySearchButton.click();
    }

    async getSuggestions(): Promise<string[]> {
        try {
            // Wait for at least one suggestion to become visible
            await this.partySuggestions.first().waitFor({ state: 'visible', timeout: 500 });
    
            // Get and return the trimmed text content of all suggestion elements
            return await this.partySuggestions.evaluateAll((elements) =>
                elements.map((el) => el.textContent?.trim() || '')
            );
        } catch {
            // If no suggestions appear in time, return an empty list
            return [];
        }
    }

    getTitle(): Promise<string> {
        return this.page.title();
    }

    /**
     * Returns the text of each cell in the results table as a 2D array,
     * where each sub-array is one row of cells.
     */
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
