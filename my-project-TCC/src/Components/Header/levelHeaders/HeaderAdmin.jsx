import React, { useState } from 'react';
import './headeradmin.css';
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

export default function HeaderAdmin({ onSearch, initialFilters, perfil  }) {
  const [openProfile, setOpenProfile] = useState(false);
  const { logout } = useAuth(); // Função de logout
  const navigate = useNavigate(); // Para redirecionar

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  const { user } = useAuth();

  return (
    <header className="headeradmin-header">
      <nav className="headeradmin-nav">
        <div className="headeradmin-nav-left">
          <Link to={"/"}>INICIO</Link>
        </div>
      
        <div className="headeradmin-container-logo">
          <img src={LogoLP} alt="Logo DivulgAí" className="headeradmin-logo" />
        </div>
        <div className='headeradmin-nav-right'>
          <Link to={"/dev-hub"}>GERENCIAMENTO</Link></div>

          <Link to='/' onClick={handleLogout}>
            <CiLogout className='headeradmin-exit' />
          </Link>

          </nav>
      <div className="headeradmin-searchbar">
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
