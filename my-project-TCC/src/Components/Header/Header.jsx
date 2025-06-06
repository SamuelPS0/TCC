// Header.jsx
import React from 'react';
import './Header.css';
import SearchBar from '../SearchBar/SearchBar';

export default function Header() {
  return (
    <header className="header">
      <a href="/" className="logo" aria-label="Página inicial" />
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
      <SearchBar />
    </header>
  );
}
