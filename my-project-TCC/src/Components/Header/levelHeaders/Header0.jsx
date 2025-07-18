import React from 'react';
import '../levelHeaders/Header0.css';
import { Link } from 'react-router-dom';
import Logo from '../../../img/logoSemFundo.png';

export default function Header0() {
  return (
    <div>
      <header className='header0-header'>
        <nav className='header0-nav' >
          <Link to="/">Início</Link>
          <Link to="/home-list">Buscar Prestadores</Link>
          <img src={Logo} alt="Logo DivulgAí" className='header0-img'/>
          <Link to="/Register">Cadastre-se</Link>       
          <Link to="/Login"><span className='header0-login'>Login</span></Link>
        </nav>
      </header>
    </div>
  );
}
