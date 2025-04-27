// src/components/PartySearch.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Pagination,
  MenuItem
} from '@mui/material';
import { formatMatchScore, formatSanctionsStatus } from '../../utils/formatters';
import { searchParties, Party, Pagination as PaginationData } from '../../services/partyApiService';

const PartySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState<Party[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [results, setResults] = useState<Party[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalResults: 0
  });
  const [statusFilter, setStatusFilter] = useState('All');
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: 'partyId', header: 'Party ID' },
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'sanctionsStatus', header: 'Sanctions Status' },
    { key: 'matchScore', header: 'Match Score' }
  ];

  // 🔥 Updated handleSearch accepting optional overrideStatusFilter
  const handleSearch = async (
    searchQuery?: string,
    overridePage?: number,
    overrideStatusFilter?: string
  ) => {
    const effectiveQuery = searchQuery ?? query;
    const effectiveStatusFilter = overrideStatusFilter ?? statusFilter;

    if (!effectiveQuery.trim()) return;

    setLoading(true);
    setMessage(undefined);

    try {
      const response = await searchParties({
        query: effectiveQuery,
        page: overridePage ?? pagination.currentPage,
        pageSize: pagination.pageSize,
        sanctionsStatus: effectiveStatusFilter !== 'All' ? effectiveStatusFilter : undefined,
      });

      setResults(response.results);
      setPagination(response.pagination);

      if (response.results.length === 0) {
        setMessage(response.message || `No parties found matching '${effectiveQuery}'`);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setMessage('An error occurred while searching. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch suggestions only for typing (no sanctionsStatus filter)
  useEffect(() => {
    const trimmedQuery = query.trim();

    if ((trimmedQuery.length >= 3) && shouldFetchSuggestions) {
      const timeoutId = setTimeout(() => {
        searchParties({ query: trimmedQuery, page: 1, pageSize: 10 })
          .then(response => setSuggestions(response.results))
          .catch(err => {
            console.error('Error fetching suggestions:', err);
            setSuggestions([]);
          });
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
    setHighlightedIndex(-1);
  }, [query, shouldFetchSuggestions]);

  const handleSuggestionClick = (suggestion: Party) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setShouldFetchSuggestions(false);
    handleSearch(suggestion.name, 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          setSuggestions([]);
          handleSearch();
        }
      }
    } else if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShouldFetchSuggestions(true);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    handleSearch(undefined, page, statusFilter);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setMessage(undefined);
  };

  return (
    <Box sx={{ p: 2, position: 'relative' }}>
      <Typography variant="h5" gutterBottom>
        Party Search
      </Typography>

      {/* Top section: search + buttons + filter */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          mb: 2
        }}
      >
        {/* Search input and buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, maxWidth: '70%' }}>
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <TextField
              label="Enter party name or ID"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              inputProps={{ 'data-testid': 'party-search-input' }}
              fullWidth
            />
            {suggestions.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  maxHeight: 300,
                  overflowY: 'auto'
                }}
              >
                {suggestions.map((sugg, index) => (
                  <Box
                    key={index}
                    onClick={() => handleSuggestionClick(sugg)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    data-testid={`suggestion-${index}`}
                    sx={{
                      p: 1,
                      cursor: 'pointer',
                      backgroundColor: index === highlightedIndex ? 'grey.200' : 'transparent'
                    }}
                  >
                    {sugg.name}
                  </Box>
                ))}
              </Paper>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              setSuggestions([]);
              handleSearch();
            }}
            data-testid="party-search-button"
            disabled={loading || !query.trim()}
            sx={{ height: '56px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            data-testid="clear-search-button"
            disabled={query.trim() === ''}
            sx={{ height: '56px' }}
          >
            Clear
          </Button>
        </Box>

        {/* Status filter */}
        <Box sx={{ minWidth: 200 }}>
          <TextField
            select
            label="Sanctions Status"
            value={statusFilter}
            onChange={(e) => {
              const newStatus = e.target.value;
              setStatusFilter(newStatus);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
              handleSearch(undefined, 1, newStatus);
            }}
            size="small"
            fullWidth
            data-testid="sanctions-status-filter"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="PendingReview">Pending Review</MenuItem>
            <MenuItem value="Escalated">Escalated</MenuItem>
            <MenuItem value="ConfirmedMatch">Confirmed Match</MenuItem>
            <MenuItem value="FalsePositive">False Positive</MenuItem>
          </TextField>
        </Box>
      </Box>

      {/* Results or message */}
      {message && !loading && (
        <Typography
          variant="body1"
          color="error"
          data-testid="no-results-message"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}

      {results.length > 0 && !loading && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table data-testid="search-results-table">
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell key={col.key}>{col.header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row, index) => (
                <TableRow key={index}>
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      {col.key === 'matchScore'
                        ? formatMatchScore(row[col.key as keyof Party])
                        : col.key === 'sanctionsStatus'
                          ? formatSanctionsStatus(row[col.key as keyof Party] as string)
                          : row[col.key as keyof Party]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                data-testid="search-results-pagination"
              />
            </Box>
          )}
        </TableContainer>
      )}
    </Box>
  );
};

export default PartySearch;
