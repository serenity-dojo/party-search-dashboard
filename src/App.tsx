// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './styles/main.css';

// ✅ Add this new component for health check
const HealthPage: React.FC = () => {
  return <div>OK</div>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/health" element={<HealthPage />} />
      </Routes>
    </Router>
  );
};

export default App;
