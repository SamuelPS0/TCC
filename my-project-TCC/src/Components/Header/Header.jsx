import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

export default function Header({ onSearch }) {
  return (
    <header className="header">
      <nav className="nav">
        <Link to={"/sobre-nos"}>Sobre Nós</Link>
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
        {/* <img className='logo' src={Logo} alt="Logo DivulgAí" title="LogoDivulgAí" /> */}
      </div>
      <SearchBar onSearch={onSearch} />
    </header>
  );
}
