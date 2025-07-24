import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Components/AuthContext';
import './HeaderCliente.css';
import LogoLP from '../../../img/logoSemFundo.png';
import SearchBar from '../../SearchBar/SearchBar';

export default function HeaderCliente({ onSearch, initialFilters }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();          // limpa user e localStorage
    navigate('/');     // redireciona para landing page
  }

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
            <Link to={"/client-accinfo"}>MINHA CONTA</Link>
            </div>
            <span className="headerclient-container-login">
              <button onClick={handleLogout} className="headerclient-nav">
                SAIR
              </button>
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
