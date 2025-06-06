import React from 'react';
import './SearchBar.css';

export default function SearchBar() {
  return (
    <section className="container-searchbar" aria-label="Barra de busca">
      <div className="search-wrapper">
        <form className="input-group horizontal" role="search" onSubmit={(e) => e.preventDefault()}>
          <div className="input-wrapper">
            <label htmlFor="search-keyword" className="input-label">O que?</label>
            <input
              id="search-keyword"
              type="text"
              placeholder="Cargo ou palavra-chave"
              className="input-field"
            />
          </div>

          <div className="input-wrapper input-wrapper-right">
            <label htmlFor="search-location" className="input-label">Onde?</label>
            <input
              id="search-location"
              type="text"
              value="São Paulo - SP"
              className="input-field"
              readOnly
            />
          </div>

          <button type="submit" className="search-button">Buscar</button>
        </form>
      </div>
    </section>
  );
}
