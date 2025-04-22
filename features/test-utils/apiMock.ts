// src/testUtils/apiMock.ts
import { match } from 'assert';
import { Page } from 'playwright';

export interface PartyRow {
    'Party ID': string;
    'Name': string;
    'Type': string;
    'Sanctions Status': string;
    'Match Score': number;
}

/**
 * Sets up the Party API mock for the given query.
 * 
 * @param page - The Playwright Page instance.
 * @param query - The search query to match.
 * @param dataRows - Array of objects representing party rows (from a Cucumber data table, for example).
 */
export async function setupPartyApiMock(
    page: Page,
    query: string,
    dataRows: PartyRow[]
): Promise<void> {
    const results = dataRows.map(row => ({
        partyId: row['Party ID'],
        name: row['Name'],
        type: row['Type'],
        sanctionsStatus: row['Sanctions Status'],
        matchScore: row['Match Score'],    
    }));

    const pagination = {
        currentPage: 1,
        pageSize: 10,
        totalPages: results.length > 0 ? 1 : 0,
        totalResults: results.length,
    };

    const responseBody: any = { results, pagination };
    if (results.length === 0) {
        responseBody.message = `No parties found matching '${query}'`;
    }

    await page.route('**/api/parties**', async (route) => {
        const url = new URL(route.request().url());
    
        const actualQuery = url.searchParams.get('query')?.trim().toLowerCase();
        const expectedQuery = query.trim().toLowerCase();
    
        if (actualQuery === expectedQuery) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(responseBody),
            });
        } else {
            console.warn(`🟡 Unmatched query: ${actualQuery} (expected: ${expectedQuery})`);
            await route.continue(); // let it fall through
        }
    });
}
