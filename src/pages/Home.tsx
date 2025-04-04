// src/pages/Home.tsx
import React from 'react';
import MenuBar from '../components/MenuBar/MenuBar';
import PartySearch from '../components/PartySearch/PartySearch';

const Home: React.FC = () => {
  return (
    <div>
      <MenuBar />
      <PartySearch />
    </div>
  );
};

export default Home;
