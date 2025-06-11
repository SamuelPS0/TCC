import React, { useState } from 'react';
import { IoPersonCircle, IoShieldOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { Link, useLocation } from 'react-router-dom';
import './SideMenu.css';

export default function SideMenu() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const menuItems = [
    { path: '/create-perfil', label: 'Perfil', icon: <IoPersonCircle className='icon' /> },
    { path: '/acc-info', label: 'Informações da conta', icon: <IoShieldOutline className='icon' /> },
    { path: '/', label: 'Voltar à tela inicial', icon: <IoMdArrowBack className='icon' /> },
    { path: '/register', label: 'Sair', icon: <CiLogout className='icon' /> }, // Agora redireciona
  ];

  return (
    <div className='container-sidemenu'>
      <ul>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path && hovered === null;
          const isHovering = hovered === item.path;

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`menu-li ${isActive || isHovering ? 'selected' : ''}`}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
