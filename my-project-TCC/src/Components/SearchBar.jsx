import React from 'react'
import './SearchBar.css';

export default function SearchBar(){
    return(
<div className="container-searchbar">
  <div className="input-group">
    <label className="input-label">O que?</label>
    <input type="text" placeholder="Cargo ou palavra-chave" className="input-field" />
  </div>

  <div className="input-group">
    <label className="input-label">Onde?</label>
    <input type="text" value="São Paulo - SP" className="input-field" readOnly />
  </div>

  <button className="search-button">Buscar</button>
</div>

    )
}