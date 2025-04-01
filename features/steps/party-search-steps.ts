import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { setupPartyApiMock, PartyRow } from '../test-utils/apiMock';

Given('the Party API returns the following parties for the search query {string}:', async function (query: string, dataTable) {
    const rows: PartyRow[] = dataTable.hashes();
    await setupPartyApiMock(this.page, query, rows);
});

// "Given the Party API returns no parties for the search query {string}"
Given('the Party API returns no parties for the search query {string}', async function (query: string) {
    await setupPartyApiMock(this.page, query, []);
});

// "Given Connie is on the party search page"
Given('Connie is on the party search page', async function () {
    await this.dashboardPage.navigate();
});

// "When Connie searches for {string}"
When('Connie searches for {string}', async function (searchQuery: string) {
    await this.dashboardPage.searchParty(searchQuery);
});

// "Then the search results should contain exactly:"
Then('the search results should contain exactly:', async function (dataTable) {
    // Convert the Gherkin data table into an array of objects
    const expectedRows = dataTable.hashes();

    // Retrieve the actual results from the UI via your page object
    const results = await this.dashboardPage.getSearchResults();

    // Use a single deep equality check to confirm they match exactly
    expect(results).toEqual(expectedRows);
});


// "Then Connie should see a message: {string}"
Then('Connie should see a message: {string}', async function (message: string) {
    const actualMessage = await this.dashboardPage.getNoResultsMessage();
    expect(actualMessage).toBe(message);
});
