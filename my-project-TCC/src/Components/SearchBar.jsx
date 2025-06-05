import React from 'react'
import './SearchBar.css';

export default function SearchBar(){
    return(

    <div className="container-searchbar">
      <div className="search-wrapper">
        <div className="input-group horizontal">
          <div className="input-wrapper">
            <label className="input-label">O que?</label>
            <input type="text" placeholder="Cargo ou palavra-chave" className="input-field" />
          </div>

          <div className="input-wrapper">
            <div className="input-wrapper-right">

            <label className="input-label">Onde?</label>
            
            <input type="text" value="São Paulo - SP" className="input-field" readOnly />
          </div>
            </div>
          <button className="search-button">Buscar</button>
        </div>
      </div>
    </div>
  );

}