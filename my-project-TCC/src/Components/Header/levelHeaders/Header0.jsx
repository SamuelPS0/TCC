import React from 'react';
import '../levelHeaders/Header0.css';
import { Link } from 'react-router-dom';
import Logo from '../../../img/logoSemFundo.png';

export default function Header0() {
  return (
    <div>
      <header className='header0-header'>
        <nav className='header0-nav' >
          <Link to="/">INÍCIO</Link>
          <Link to="/home-list">BUSCAR PRESTADORES</Link>
          <img src={Logo} alt="Logo DivulgAí" className='header0-img'/>
          <Link to="/Register" className='header0-cadastro'>CADASTRO</Link>       
          <Link to="/Login"><span className='header0-login'>LOGIN</span></Link>
        </nav>
      </header>
    </div>
  );
}
