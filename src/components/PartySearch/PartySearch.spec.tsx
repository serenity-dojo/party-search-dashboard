import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PartySearch from './PartySearch';
import { searchParties } from '../../services/partyApiService';

jest.mock('../../services/partyApiService');

describe('PartySearch component suggestion behavior', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should fetch suggestions when user types "Paul"', async () => {
    const searchPartiesMock = searchParties as jest.MockedFunction<typeof searchParties>;
    searchPartiesMock.mockResolvedValueOnce({
      results: [],
      pagination: { currentPage: 1, pageSize: 10, totalPages: 0, totalResults: 0 }
    });
  
    render(<PartySearch />);
    const input = screen.getByTestId('party-search-input');
  
    fireEvent.change(input, { target: { value: 'Paul' } });
    jest.advanceTimersByTime(300);
  
    await waitFor(() => {
      expect(searchPartiesMock).toHaveBeenCalledWith(
        expect.objectContaining({ query: 'Paul' })
      );
    });
  });

  it('should NOT fetch suggestions when user types "Pa" (less than 3 chars)', () => {
    const searchPartiesMock = searchParties as jest.MockedFunction<typeof searchParties>;
    searchPartiesMock.mockResolvedValueOnce({
      results: [],
      pagination: { currentPage: 1, pageSize: 10, totalPages: 0, totalResults: 0 }
    });

    render(<PartySearch />);
    const input = screen.getByTestId('party-search-input');

    fireEvent.change(input, { target: { value: 'Pa' } });
    jest.advanceTimersByTime(300);

    expect(searchPartiesMock).not.toHaveBeenCalled();
  });

  it('should fetch suggestions when user types "P1234" (party ID with enough chars)', async () => {
    const searchPartiesMock = searchParties as jest.MockedFunction<typeof searchParties>;
    searchPartiesMock.mockResolvedValueOnce({
      results: [],
      pagination: { currentPage: 1, pageSize: 10, totalPages: 0, totalResults: 0 }
    });

    render(<PartySearch />);
    const input = screen.getByTestId('party-search-input');

    fireEvent.change(input, { target: { value: 'P1234' } });
    jest.advanceTimersByTime(300);

    await waitFor(() => {
        expect(searchPartiesMock).toHaveBeenCalledWith(
          expect.objectContaining({ query: 'P1234' })
        );
      });
  });

  it('should NOT fetch suggestions when user types "P123" (party ID too short)', () => {
    const searchPartiesMock = searchParties as jest.MockedFunction<typeof searchParties>;
    searchPartiesMock.mockResolvedValueOnce(Promise.resolve({
        results: [],
        pagination: { currentPage: 1, pageSize: 10, totalPages: 0, totalResults: 0 }
      }));

    render(<PartySearch />);
    const input = screen.getByTestId('party-search-input');

    fireEvent.change(input, { target: { value: 'P123' } });
    jest.advanceTimersByTime(300);

    expect(searchPartiesMock).not.toHaveBeenCalled();
  });

});
