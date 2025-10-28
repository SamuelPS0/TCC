import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchBar.css';

export default function SearchBar({
  onSearch,
  shouldNavigate = false,
  initialCategory = '',
  initialLocation = ''
}) {
  const [categorias, setCategorias] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Carrega categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/categoria');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    fetchCategorias();
  }, []);

  // Atualiza categoria/localização se props mudarem
  useEffect(() => setCategory(initialCategory), [initialCategory]);
  useEffect(() => setLocation(initialLocation), [initialLocation]);

  // Sugestões de cidades
  useEffect(() => {
    if (location.length < 3) {
      setSuggestions([]);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const data = await res.json();
        const filtered = data
          .filter(city => city.nome.toLowerCase().includes(location.toLowerCase()))
          .slice(0, 5)
          .map(city => ({
            display: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`
          }));
        setSuggestions(filtered);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [location]);

  const handleSelectSuggestion = (cidade) => {
    setLocation(cidade.display); // mantém "Cidade - UF"
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ category, location });

    if (shouldNavigate) {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      navigate('/home-list?' + params.toString());
    }
  };

  return (
    <section className="container-searchbar" aria-label="Barra de busca">
      <div className="search-wrapper">
        <form
          className="input-group horizontal"
          role="search"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Select de categoria */}
          <div className="input-wrapper">
            <label htmlFor="search-keyword" className="input-label">
              O que?
            </label>
            <select
              id="search-keyword"
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat, i) => (
                <option key={i} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Input de localização */}
          <div className="input-wrapper input-wrapper-right">
            <label htmlFor="search-location" className="input-label">
              Onde?
            </label>
            <input
              id="search-location"
              type="text"
              placeholder="Digite a cidade"
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Botão de busca */}
          <button type="submit" className="search-button">
            Buscar
          </button>
        </form>
      </div>

      {/* Lista de sugestões */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((cidade, i) => (
            <li
              key={i}
              onMouseDown={(e) => e.preventDefault()} // evita blur no input
              onClick={() => handleSelectSuggestion(cidade)}
              className="suggestion-item"
            >
              {cidade.display}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
