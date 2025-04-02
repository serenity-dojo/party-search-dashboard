// src/components/PartySearch.tsx
import React, { useState } from 'react';
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
  const [results, setResults] = useState<Party[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalResults: 0
  });
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Columns for the results table
  const columns = [
    { key: 'partyId', header: 'Party ID' },
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'sanctionsStatus', header: 'Sanctions Status' },
    { key: 'matchScore', header: 'Match Score' }
  ];

  // Handle search form submission
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setMessage(undefined);
    
    try {
      const response = await searchParties({ 
        query, 
        page: pagination.currentPage,
        pageSize: pagination.pageSize 
      });
      
      setResults(response.results);
      setPagination(response.pagination);
      
      if (response.results.length === 0) {
        setMessage(response.message || `No parties found matching '${query}'`);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setMessage('An error occurred while searching. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const newPagination = { ...pagination, currentPage: page };
    setPagination(newPagination);
    
    // Re-fetch with new page
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
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Party Search
      </Typography>
      
      {/* Search Form */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <TextField
          label="Enter party name or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{
            'data-testid': 'party-search-input'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          data-testid="party-search-button"
          disabled={loading || !query.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>
      
      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* No Results Message */}
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
      
      {/* Results Table */}
      {results.length > 0 && !loading && (
        <TableContainer component={Paper}>
          <Table data-testid="search-results-table">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {row[col.key as keyof Party]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
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