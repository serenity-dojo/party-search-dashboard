// src/components/MenuBar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const MenuBar: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Bank Sanctions Dashboard
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Party Search</Button>
        <Button color="inherit">About</Button>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
