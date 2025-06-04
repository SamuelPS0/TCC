import React from 'react';

import './Header.css';

export default function Header() {
  return (

    <div>
        <header className='header'>
            <a href="/" className='Logo'></a>

    <nav className='nav'>
        <div className='f1'>
        <a href="#">Sobre nós</a>
        <a href="#">Encontrar serviços</a>
        <a href="#">Mais procurados</a>
        <a href="#">Categorias</a>
        </div>
           <div className='nav2'>
        <a href="#">Empresas perto de mim</a>
        <a href="#">Login</a>
        </div>
    </nav>
   </header>

        <nav className='categories'>
            <button className='button'>Modelo de trabalho</button>
            <button className='button'>Publicado em</button>
            <button className='button'>Distancia</button>
            <button className='button'>Preço</button>
            <button className='button'>Categorias</button>
            <button className='button'>Disponibilidades</button>
        </nav>
    </div>
        
  );
}
