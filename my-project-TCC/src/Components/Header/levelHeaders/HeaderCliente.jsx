import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import LogoLP from '../../img/logoSemFundo.png';

export default function Header({ onSearch, initialFilters }) {
  return (
    <header className="header">
<nav className="nav">
  <div className="nav-left">
    <Link to={"/"}>INICIO</Link>
    <Link to={"/home-list"}>BUSCAR PRESTADORES</Link>
  </div>

  <div className="container-logo">
    <img src={LogoLP} alt="Logo DivulgAí" className="logo" />
  </div>

  <div className="nav-right frame-2">
    <div className="container-register">
      <Link to={"/Register"}>CADASTRO</Link>  
    </div>        
    <span className="container-login">
      <Link to={"/Login"}>LOGIN</Link>
    </span>
  </div>
</nav>

    <div className='header-searchbar'>
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
