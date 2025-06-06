// Header.jsx
import React from 'react';
import './Header.css';
import SearchBar from '../SearchBar/SearchBar';
import Logo from "/workspaces/TCC/my-project-TCC/src/img/divulgai-semfundo.png";

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <a href="#">Sobre nós</a>
        <a href="#">Encontrar serviços</a>
        <a href="#">Mais procurados</a>
        <a href="#">Categorias</a>
        <div className="frame-2">
          <a href="#">Empresas perto de mim</a>
          <span className="container-login">
            <a href="#">Login</a>
          </span>
        </div>
      </nav>
      <div className='container-logo'>
    <img className='logo' src={Logo} alt="Logo DivulgAí" title="LogoDivulgAí"></img>
    </div>
      <SearchBar />
    </header>
  );
}
