import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';


// Componente funcional Header recebe duas props: onSearch (função) e initialFilters (objeto opcional)
export default function Header({ onSearch, initialFilters }) {
  return (
    // Elemento semanticamente correto para cabeçalho da página
    <header className="header">

      {/* Barra de navegação principal */}
      <nav className="nav">
        {/* Links para diferentes rotas do app */}
        <Link to={"/"}>Sobre Nós</Link>
        <Link to={"/acc-info"}>Info-conta</Link>
        <Link to={"/create-perfil"}>Perfil (provisório)</Link>
        <Link to={"/categorias"}>Categorias</Link>

        {/* Container para os links de cadastro e login */}
        <div className="frame-2">
          <Link to={"/Register"}>Cadastrar</Link>          
          <span className="container-login">
            <Link to={"/Login"}>Login</Link>
          </span>
        </div>
      </nav>

      {/* Área reservada para o logo */}
      <div className='container-logo'>
      </div>

      {/* Componente de busca que recebe função onSearch e filtros iniciais opcionais */}
      <SearchBar 
        onSearch={onSearch} 
        initialCategory={initialFilters?.category} 
        initialLocation={initialFilters?.location} 
        shouldNavigate={true}

      />
    </header>
  );
}

