import React, { useState } from 'react'; 
import { IoPersonCircle, IoShieldOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { Link, useLocation } from 'react-router-dom'; // para navegação e localização da rota atual
import './SideMenu.css';

export default function SideMenu() {
  
  // Hook para pegar a rota atual, usado para destacar o item ativo no menu
  const location = useLocation();

  // Estado para armazenar qual item está sendo "hovered" (com mouse por cima)
  const [hovered, setHovered] = useState(null);

  // Definição dos itens do menu, com caminho, texto e ícone
  const menuItems = [
    { path: '/create-perfil', label: 'Perfil', icon: <IoPersonCircle className='icon' /> },
    { path: '/acc-info', label: 'Informações da conta', icon: <IoShieldOutline className='icon' /> },
    { path: '/', label: 'Voltar à tela inicial', icon: <IoMdArrowBack className='icon' /> },
    { path: '/login', label: 'Sair', icon: <CiLogout className='icon' /> }, // redireciona para a página de registro/logout
  ];

  return (
    <div className='container-sidemenu'>
      <ul>
        {/* Percorre os itens do menu para renderizar cada um */}
        {menuItems.map((item) => {
          // Verifica se a rota atual corresponde ao caminho do item e se o mouse não está sobre nenhum item
          const isActive = location.pathname === item.path && hovered === null;

          // Verifica se o mouse está passando por cima do item atual
          const isHovering = hovered === item.path;

          return (
            <li key={item.path}>
              <Link
                to={item.path} // define o link para navegação
                className={`menu-li ${isActive || isHovering ? 'selected' : ''}`} 
                // Adiciona a classe 'selected' se o item estiver ativo ou em hover para destaque visual
                onMouseEnter={() => setHovered(item.path)} // ao entrar com mouse, seta o hovered
                onMouseLeave={() => setHovered(null)} // ao sair, remove o hovered
              >
                {item.icon} {/* renderiza o ícone do item */}
                {item.label} {/* renderiza o texto do item */}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
