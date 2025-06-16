import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

export default function Header({ onSearch, initialFilters }) {
  return (
    <header className="header">
      <nav className="nav">
        <Link to={"/"}>Sobre Nós</Link>
        <Link to={"/acc-info"}>Info-conta</Link>
        <Link to={"/create-perfil"}>Perfil (provisório)</Link>
        <Link to={"/categorias"}>Categorias</Link>
        <div className="frame-2">
          <Link to={"/Register"}>Cadastrar</Link>          
          <span className="container-login">
            <Link to={"/Login"}>Login</Link>
          </span>
        </div>
      </nav>
      <div className='container-logo'>
        {/* logo aqui */}
      </div>
      <SearchBar onSearch={onSearch} initialCategory={initialFilters?.category} initialLocation={initialFilters?.location} />
    </header>
  );
}
