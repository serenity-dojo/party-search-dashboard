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
export const searchParties = async (params: PartySearchParams): Promise<PartySearchResponse> => {
    try {
        console.log('Search Parties Query: ${API_BASE_URL}/parties?query=', params.query);

        const response = await axios.get(`${API_BASE_URL}/parties`, {
            params: {
                query: params.query,
                page: params.page || 1,
                pageSize: params.pageSize || 10,
                sortBy: params.sortBy,
                sortDirection: params.sortDirection,
            },
        });
        console.log('API request:', response.request);
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        // Log the error and return an empty result set with a message
        console.error('Error searching for parties:', error);
        return {
            results: [],
            pagination: {
                currentPage: params.page || 1,
                pageSize: params.pageSize || 10,
                totalPages: 0,
                totalResults: 0,
            },
            message: `No parties found matching '${params.query}'`,
        };
    }
};
