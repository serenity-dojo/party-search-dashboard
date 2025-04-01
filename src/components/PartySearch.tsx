// src/components/PartySearch.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface Party {
  partyId: string;
  name: string;
  type: string;
  sanctionsStatus: string;
  matchScore: string;
}

const columns = [
  { key: 'partyId', header: 'Party ID' },
  { key: 'name', header: 'Name' },
  { key: 'type', header: 'Type' },
  { key: 'sanctionsStatus', header: 'Sanctions Status' },
  { key: 'matchScore', header: 'Match Score' },
];

const PartySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [parties, setParties] = useState<Party[]>([]);
  const [results, setResults] = useState<Party[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // @ts-ignore: Load test data injected into the window
    const data = window.__PARTIES__;
    if (data) {
      // Transform incoming data (from the feature file with human-friendly headers)
      // into our internal data model with idiomatic keys.
      const transformed: Party[] = data.map((item: any) => ({
        partyId: item["Party ID"],
        name: item["Name"],
        type: item["Type"],
        sanctionsStatus: item["Sanctions Status"],
        matchScore: item["Match Score"],
      }));
      setParties(transformed);
    }
  }, []);

  const handleSearch = () => {
    const filtered = parties.filter((party) =>
      party.partyId.toLowerCase().includes(query.toLowerCase()) ||
      party.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    if (filtered.length === 0) {
      setMessage(`No parties found matching '${query}'`);
    } else {
      setMessage('');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Party Search
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <TextField
          label="Enter party name or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="party-search-input"
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          data-testid="party-search-button"
        >
          Search
        </Button>
      </Box>
      {results.length > 0 && (
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
        </TableContainer>
      )}
      {message && (
        <Typography
          variant="body1"
          color="error"
          data-testid="no-results-message"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default PartySearch;
