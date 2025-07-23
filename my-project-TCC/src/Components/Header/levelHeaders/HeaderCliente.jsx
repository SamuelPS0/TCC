import React from 'react';
import './HeaderCliente.css';
import { Link } from 'react-router-dom';
import SearchBar from '../../SearchBar/SearchBar';
import LogoLP from '../../../img/logoSemFundo.png';

export default function Header({ onSearch, initialFilters }) {
  return (
    <header className="headerclient-header">
      <nav className="headerclient-nav">
        <div className="headerclient-nav-left">
          <Link to={"/"}>INICIO</Link>
          <Link to={"/home-list"}>BUSCAR PRESTADORES</Link>
        </div>

        <div className="headerclient-container-logo">
          <img src={LogoLP} alt="Logo DivulgAí" className="headerclient-logo" />
        </div>

        <div className="headerclient-nav-right headerclient-frame-2">
          <div className="headerclient-container-register">
            <Link to={"/Register"}>CADASTRO</Link>  
          </div>        
          <span className="headerclient-container-login">
            <Link to={"/Login"}>SAIR</Link>
          </span>
        </div>
      </nav>

      <div className="headerclient-searchbar">
        <SearchBar 
          onSearch={onSearch} 
          initialCategory={initialFilters?.category} 
          initialLocation={initialFilters?.location} 
          shouldNavigate={true}
        />
      </div>
    </header>
  );
}
