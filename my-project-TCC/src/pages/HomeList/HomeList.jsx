// Importa React, o hook useState e useEffect do React
import React, { useState, useEffect } from 'react';
// Importa o hook useLocation do react-router-dom para acessar a URL e seus parâmetros de busca
import { useLocation } from 'react-router-dom'; 
// Importa o componente Header (contém a barra de busca e filtros)
import Header from '../../Components/Header/Header';
// Importa o componente PerfilList (exibe a lista de perfis filtrados)
import PerfilList from '../../Components/PerfilList/PerfilList';
import './HomeList.css';

// Define o componente funcional HomeList
const HomeList = () => {
  // Pega informações da URL, por exemplo ?category=professor&location=sp
  const location = useLocation();
  
  // Função para ler a query string e transformar em um objeto com os filtros
  const getFiltersFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return {
      category: params.get('category') || '', // pega category da URL ou vazio
      location: params.get('location') || '', // pega location da URL ou vazio
    };
  };

  // Estado que guarda os filtros atuais, inicializados com o que está na URL
  const [filters, setFilters] = useState(getFiltersFromQuery);

  // Efeito que roda sempre que a URL mudar:
  // Atualiza os filtros com base na nova URL
  useEffect(() => {
    setFilters(getFiltersFromQuery());
  }, [location.search]); // Dependência: location.search

  // Função chamada quando o usuário faz uma nova busca via Header
  // Atualiza o estado filters com os novos valores
  const handleSearch = ({ category, location }) => {
    setFilters({ category, location });
  };

  return (
    <div className='background-color-homepage'>
      {/* Renderiza o Header passando a função para lidar com busca e os filtros atuais */}
      <Header onSearch={handleSearch} initialFilters={filters} />
      {/* Renderiza a lista de perfis filtrados conforme o estado filters */}
      <PerfilList filters={filters} />
    </div>
  );
};

// Exporta o componente HomeList como export default
export default HomeList;
