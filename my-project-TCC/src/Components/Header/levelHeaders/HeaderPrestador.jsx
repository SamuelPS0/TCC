import React, { useState } from 'react';
import './HeaderPrestador.css';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../../SearchBar/SearchBar';
import LogoLP from '../../../img/logoSemFundo.png';

import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineShield } from "react-icons/md";
import { FaRegAngry, FaRegClipboard } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { IoMdMenu } from "react-icons/io";

// Importa o contexto de autenticação
import { useAuth } from '../../AuthContext';

export default function HeaderPrestador({ onSearch, initialFilters }) {
  const [openProfile, setOpenProfile] = useState(false);
  const { logout } = useAuth(); // Função de logout
  const navigate = useNavigate(); // Para redirecionar

  const handleLogout = () => {
    logout();         // Limpa localStorage + AuthContext
    navigate('/');    // Redireciona para a landing page
  };

  return (
    <header className="headerprestador-header">
      <nav className="headerprestador-nav">
        <div className="headerprestador-nav-left">
          <Link to={"/"}>INICIO</Link>
        </div>

        <div className="headerprestador-container-logo">
          <img src={LogoLP} alt="Logo DivulgAí" className="headerprestador-logo" />
        </div>

        <div className="headerprestador-nav-right">
          <Link to={"/home-list"}>BUSCAR SERVIÇOS</Link>

          <button
            className="headerprestador-dropdown-toggle"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <IoMdMenu className="headerprestador-dropdown-menu" />
          </button>
        </div>
      </nav>

      {openProfile && (
        <div className="headerprestador-dropdown">
          <ul className="headerprestador-list">
            <li><Link to='/create-perfil' className='headerprestador-link'><IoPersonCircleOutline className="headerprestador-list-icon" />MEU PERFIL</Link></li>
            <li><Link to='/acc-info' className='headerprestador-link'><MdOutlineShield className="headerprestador-list-icon" />MINHA CONTA</Link></li>
            <li><Link to='/profile' className='headerprestador-link'><FaRegAngry className="headerprestador-list-icon" />MINHAS DENÚNCIAS</Link></li>
            <li><Link to='/profile' className='headerprestador-link'><FaRegClipboard className="headerprestador-list-icon" />MEUS FEEDBACKS</Link></li>
            <li onClick={handleLogout} className='headerprestador-link' style={{ cursor: 'pointer' }}>
              <CiLogout className="headerprestador-list-icon" />SAIR
            </li>
          </ul>
        </div>
      )}

      <div className="headerprestador-searchbar">
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
