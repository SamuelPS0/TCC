import React, { useState } from 'react';
import Header from '../../Components/Header/Header';
import PerfilList from '../../Components/PerfilList/PerfilList';
import './Home.css';

const Home = () => {
  const [filters, setFilters] = useState({
    category: '',
    location: ''
  });

  const handleSearch = ({ category, location }) => {
    setFilters({ category, location });
  };

  return (
    <div className='background-color-homepage'>
      <Header onSearch={handleSearch} />
      <PerfilList filters={filters} />
    </div>
  );
};

export default Home;
