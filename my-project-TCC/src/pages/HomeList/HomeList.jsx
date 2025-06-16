import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // para pegar query params
import Header from '../../Components/Header/Header';
import PerfilList from '../../Components/PerfilList/PerfilList';
import './HomeList.css';

const HomeList = () => {
  const location = useLocation();
  
  // Função para ler query string e transformar em objeto
  const getFiltersFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return {
      category: params.get('category') || '',
      location: params.get('location') || '',
    };
  };

  // Inicializa o estado com filtros vindos da URL
  const [filters, setFilters] = useState(getFiltersFromQuery);

  // Se quiser atualizar o filtro quando a URL mudar:
  useEffect(() => {
    setFilters(getFiltersFromQuery());
  }, [location.search]);

  const handleSearch = ({ category, location }) => {
    setFilters({ category, location });
  };

  return (
    <div className='background-color-homepage'>
      <Header onSearch={handleSearch} initialFilters={filters} />
      <PerfilList filters={filters} />
    </div>
  );
};

export default HomeList;
