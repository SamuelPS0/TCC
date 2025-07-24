import React, { useState } from 'react';
import { IoShieldOutline } from "react-icons/io5";
import { CiSearch, CiLogout } from "react-icons/ci";
import { Link, useLocation } from 'react-router-dom';
import './SideMenuCLIENT.css'

export default function SideMenuCLIENT() {
  const location = useLocation();
  const [hoverOther, setHoverOther] = useState(false);

  return (
    <div className='smclient-container'>
      <ul className='smclient-ul'>

        <li
          id='smclient-firstli'
          className={`smclient-li ${location.pathname === '/client-accinfo' && !hoverOther ? 'active' : ''}`}
        >
          <Link to='/client-acc-info' className='smclient-link'>
            <IoShieldOutline className='smclient-icon' />Informações da conta
          </Link>
        </li>

        <li
          id='smclient-middleli'
          className='smclient-li'
          onMouseEnter={() => setHoverOther(true)}
          onMouseLeave={() => setHoverOther(false)}
        >
          <Link to='/home-list' className='smclient-link'>
            <CiSearch className='smclient-icon' />Buscar prestadores
          </Link>
        </li>

        <li
          id='smclient-lastli'
          className='smclient-li'
          onMouseEnter={() => setHoverOther(true)}
          onMouseLeave={() => setHoverOther(false)}
        >
          <Link to='/logout' className='smclient-link'>
            <CiLogout className='smclient-icon' />Sair
          </Link>
        </li>

      </ul>
    </div>
  );
}
