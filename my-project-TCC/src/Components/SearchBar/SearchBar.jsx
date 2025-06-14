import React, { useState, useEffect } from 'react';
import './SearchBar.css'

const categories = [
  "Comidas Prontas",
  "Lanches e Fast Food",
  "Doces e Sobremesas",
  "Padaria e Confeitaria",
  "Sucos naturais",
  "Drinks artesanais",
  "Cafés e chás especiais",
  "Saudável e Fitness",
  "Comida italiana",
  "Comida japonesa",
  "Comida nordestina",
  "Comida árabe",
  "Comida mexicana",
  "Buffet para festas",
];

export default function SearchBar({ onSearch }) {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (location.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
        const data = await res.json();
        const filtered = data
          .filter(city => city.nome.toLowerCase().includes(location.toLowerCase()))
          .slice(0, 5)
          .map(city => ({
            display: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`,
          }));

        setSuggestions(filtered);
      } catch {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(() => fetchCities(), 300);
    return () => clearTimeout(debounce);
  }, [location]);

  const handleSelectSuggestion = (cidade) => {
    setLocation(cidade.display);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ category, location });
    }
  };

  return (
    <section className="container-searchbar" aria-label="Barra de busca" style={{ position: 'relative' }}>
      <div className="search-wrapper">
        <form className="input-group horizontal" role="search" onSubmit={handleSubmit} autoComplete="off">
          <div className="input-wrapper">
            <label htmlFor="search-keyword" className="input-label">O que?</label>
            <select
              id="search-keyword"
              className="input-field"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="input-wrapper input-wrapper-right">
            <label htmlFor="search-location" className="input-label">Onde?</label>
            <input
              id="search-location"
              type="text"
              placeholder="Digite a cidade"
              className="input-field"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <button type="submit" className="search-button">Buscar</button>
        </form>
      </div>

      {/* Dropdown fora da search-wrapper */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list" style={{
          position: 'absolute',
          top: '70px', // ajustar pra aparecer abaixo da barra
          left: 'calc(50% + 40px)', // considerando margem do input-location
          transform: 'translateX(-50%)',
          width: '280px',
          backgroundColor: 'white',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          padding: '0',
          margin: '0',
          listStyle: 'none',
          zIndex: 999,
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {suggestions.map((cidade, i) => (
            <li
              key={i}
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSelectSuggestion(cidade)}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
            >
              {cidade.display}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
