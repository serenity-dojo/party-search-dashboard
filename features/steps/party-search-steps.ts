import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { setupPartyApiMock, PartyRow } from '../test-utils/apiMock';
import { request } from '@playwright/test';

const API_BASE_URL = 'http://localhost:5044';

const generatePartyId = () => `P${Date.now()}${Math.floor(Math.random() * 1000)}`;

Given('the Party API returns the following parties for the search query {string}:', async function (query: string, dataTable) {
    const rows: PartyRow[] = dataTable.hashes().map((row: { [x: string]: string; }) => {
        return ({
            'Party ID': row['Party ID'],
            'Name': row['Name'],
            'Type': row['Type'],
            'Sanctions Status': row['Sanctions Status'],
            'Match Score': parseFloat(row['Match Score']),
        });
    });

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

Then('the search results should contain exactly:', async function (dataTable) {
    const expected = dataTable.hashes();
    const actual = await this.dashboardPage.getSearchResults();
  
    expect(actual.map(stripId)).toEqual(expected.map(stripId));
  });
  
  function stripId(row: any) {
    const { 'Party ID': _, ...rest } = row;
    return rest;
  }

// "Then Connie should see a message: {string}"
Then('Connie should see a message: {string}', async function (message: string) {
    const actualMessage = await this.dashboardPage.getNoResultsMessage();
    expect(actualMessage).toBe(message);
});

When('Connie types {string}',async function (s: string) {
    await this.dashboardPage.partySearchInput.fill(s);
})
  
Then('the following names should be suggested:', async function (expectedSuggestionList) {
    const expectedNames = expectedSuggestionList.raw().flat(); 
    const suggestions = await this.dashboardPage.getSuggestions();
    expect(suggestions).toEqual(expectedNames);
})

Then('no names should be suggested', async function () {
    const suggestions = await this.dashboardPage.getSuggestions();
    expect(suggestions.length).toBe(0);
})

Given('the following parties exist:', async function (dataTable) {
    const parties = dataTable.hashes().map(row => ({
      partyId: generatePartyId(),
      name: row['Name'],
      type: row['Type'],
      sanctionsStatus: row['Sanctions Status'],
      matchScore: parseFloat(row['Match Score']),
    }));
  
    this.createdPartyIds = [];
  
    const apiContext = await request.newContext({ baseURL: 'http://localhost:5000' });
  
    for (const party of parties) {
      const response = await apiContext.post('/api/parties', { data: party });
      if (![200, 201].includes(response.status())) {
        throw new Error(`Failed to create party: ${party.name}`);
      }
      this.createdPartyIds.push(party.partyId);
    }
  
    await apiContext.dispose();
  });