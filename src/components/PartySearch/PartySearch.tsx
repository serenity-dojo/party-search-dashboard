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
  Pagination
} from '@mui/material';
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
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: 'partyId', header: 'Party ID' },
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'sanctionsStatus', header: 'Sanctions Status' },
    { key: 'matchScore', header: 'Match Score' }
  ];

  // Fetch suggestions if the query is at least 3 characters and we want to fetch suggestions.
  useEffect(() => {
    if (query.trim().length >= 3 && shouldFetchSuggestions) {
      const timeoutId = setTimeout(() => {
        searchParties({ query, page: 1, pageSize: 10 })
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
    // Reset highlighted index whenever query or suggestion fetching changes.
    setHighlightedIndex(-1);
  }, [query, shouldFetchSuggestions]);

  // Modified search function which accepts an optional query.
  const handleSearch = async (searchQuery?: string) => {
    const effectiveQuery = searchQuery ?? query;
    if (!effectiveQuery.trim()) return;
    
    setLoading(true);
    setMessage(undefined);
    try {
      const response = await searchParties({ 
        query: effectiveQuery, 
        page: pagination.currentPage,
        pageSize: pagination.pageSize 
      });
      
      setResults(response.results);
      setPagination(response.pagination);
      
      if (response.results.length === 0) {
        setMessage(response.message || `No parties found matching '${effectiveQuery}'`);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setMessage('An error occurred while searching. Please try again. (' + error + ')');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // When a suggestion is selected (by click or pressing Enter), update the query,
  // clear the suggestions, disable further suggestion fetching, and perform a search.
  const handleSuggestionClick = (suggestion: Party) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setShouldFetchSuggestions(false);
    searchParties({ 
      query: suggestion.name, 
      page: 1, 
      pageSize: pagination.pageSize 
    })
      .then(response => {
        setResults(response.results);
        setPagination(response.pagination);
        if (response.results.length === 0) {
          setMessage(response.message || `No parties found matching '${suggestion.name}'`);
        }
      })
      .catch(error => {
        console.error('Error performing search:', error);
        setMessage('An error occurred while searching. Please try again. (' + error + ')');
        setResults([]);
      });
  };

  // Keyboard navigation for suggestions.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => {
          const nextIndex = prev + 1;
          return nextIndex < suggestions.length ? nextIndex : 0;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => {
          const nextIndex = prev - 1;
          return nextIndex >= 0 ? nextIndex : suggestions.length - 1;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          // If no suggestion is highlighted, clear suggestions and perform a normal search.
          setSuggestions([]);
          handleSearch();
        }
      }
    } else {
      if (e.key === 'Enter') {
        handleSearch();
      }
    }
  };

  // When the input changes, update the query and re-enable suggestions.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShouldFetchSuggestions(true);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const newPagination = { ...pagination, currentPage: page };
    setPagination(newPagination);
    // Re-fetch with the new page.
    searchParties({ 
      query, 
      page, 
      pageSize: pagination.pageSize 
    }).then(response => {
      setResults(response.results);
      setPagination(response.pagination);
    });
  };

  return (
    <Box sx={{ p: 2, position: 'relative' }}>
      <Typography variant="h5" gutterBottom>
        Party Search
      </Typography>
      
      {/* Search input with suggestion dropdown */}
      <Box sx={{ position: 'relative', mb: 2 }}>
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
            {suggestions.map((sugg, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <Box 
                  key={index} 
                  onClick={() => handleSuggestionClick(sugg)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  sx={{ 
                    p: 1, 
                    cursor: 'pointer',
                    backgroundColor: isHighlighted ? 'grey.200' : 'transparent'
                  }}
                >
                  {sugg.name}
                </Box>
              );
            })}
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
      >
        {loading ? <CircularProgress size={24} /> : 'Search'}
      </Button>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
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
                      {row[col.key as keyof Party]}
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
