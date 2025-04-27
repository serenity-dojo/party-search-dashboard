import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7044/api'; // Default for local dev

export async function searchParties(params: {
  query: string;
  page: number;
  pageSize: number;
  sanctionsStatus?: string;
}) {
  const { query, page, pageSize, sanctionsStatus } = params;

  const url = new URL(`${API_BASE_URL}/parties`); 

  url.searchParams.append('query', query);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('pageSize', pageSize.toString());

  if (sanctionsStatus && sanctionsStatus !== 'All') {
    url.searchParams.append('sanctionsStatus', sanctionsStatus);
  }

  try {
    const response = await axios.get(url.toString(), {
      headers: {
        'Accept': 'application/json', 
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching parties:', error);
    throw new Error('Failed to fetch parties');
  }
}
