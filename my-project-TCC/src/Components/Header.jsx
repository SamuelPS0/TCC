import React from 'react';

import './Header.css';

export default function Header() {
  return (

    <div>
        <header className='header'>
            <a href="/" className='Logo'></a>
          

    <nav className='nav'>
        <a href="#">Sobre nós</a>
        <a href="#">Encontrar serviços</a>
        <a href="#">Mais procurados</a>
        <a href="#">Categorias</a>
        <a href="#">Empresas perto de mim</a>
        <a href="#">Login</a>
    </nav>
   </header>
    </div>
        
  );
}
