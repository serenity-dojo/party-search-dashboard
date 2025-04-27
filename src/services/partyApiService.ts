// src/services/partyApiService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5044/api';

export interface Party {
    partyId: string;
    name: string;
    type: string;
    sanctionsStatus: string;
    matchScore: string;
}

export interface PartySearchParams {
    query: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sanctionsStatus?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface Pagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalResults: number;
}

export interface PartySearchResponse {
    results: Party[];
    pagination: Pagination;
    message?: string;
}

/**
 * Search for parties by name or ID
 */
// src/services/partyApiService.ts
export async function searchParties(params: {
    query: string;
    page: number;
    pageSize: number;
    sanctionsStatus?: string;
  }) {
    const { query, page, pageSize, sanctionsStatus } = params;
  
    // Create a real URL object (handles query params safely)
    const url = new URL('/api/parties', window.location.origin);
  
    url.searchParams.append('query', query);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('pageSize', pageSize.toString());
  
    // Only add sanctionsStatus if it is set and not 'All'
    if (sanctionsStatus && sanctionsStatus !== 'All') {
      url.searchParams.append('sanctionsStatus', sanctionsStatus);
    }
  
    const response = await fetch(url.toString());
  
    if (!response.ok) {
      throw new Error('Failed to fetch parties');
    }
  
    return response.json();
  }
  
  
