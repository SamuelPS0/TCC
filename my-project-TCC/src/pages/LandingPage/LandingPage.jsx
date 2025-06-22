import React from 'react';
import './LandingPage.css';
import Flash from '../../Components/Flash/Flash';
import SearchBar from '../../Components/SearchBar/SearchBar';
import LogoLP from '../../img/divulgai-logo-branca.png';

// Importa o Link do react-router-dom para navegação interna
import { Link } from 'react-router-dom';

// Define o componente funcional LandingPage
export default function LandingPage() {
  return (
    <div>
      {/* Container principal da landing page */}
      <div className="lp-allpage-container">
        
        {/* Cabeçalho com logo */}
        <div className="lp-header">
          <img className='lp-img-header' src={LogoLP} alt="Logo DivulgAí" />
        </div>

        {/* Barra de busca (filtra perfis ou categorias) */}
        {/* Também navega para a página de lista de perfís */}
        <SearchBar shouldNavigate={true} />

        {/* Seção Sobre nós */}
        <h1 className='lp-h1'>🍽️ Sobre nós</h1>
        <p className="lp-p">
          O DivulgAí é uma plataforma digital feita para conectar consumidores
          a prestadores de serviços locais do ramo da alimentação de forma simples, prática e direta.
          Aqui, você encontra aquele sabor caseiro feito com carinho, de pessoas que estão bem perto de você.
          Nosso objetivo é valorizar os pequenos negócios, fortalecer a economia local e facilitar a divulgação  
          de produtos alimentícios sem burocracia. No Divulgaí, você busca e encontra quem faz — e quem faz, se
          conecta com quem quer provar!
        </p>

        {/* Seção Por que usar o DivulgAí? */}
        <h1 className='lp-flashcontainer-h1'>Por que usar o DivulgAí?</h1>
        
        {/* Container com Flash cards de vantagens */}
        <div className="lp-flashcards-container">
          <Flash 
            title='🍲 Comida caseira' 
            paragraph='Sabores autênticos feitos por quem entende de comida de verdade.'
          />  
          <Flash 
            title='🤝 Apoie o local' 
            paragraph='Valorize os pequenos negócios e fortaleça a economia do seu bairro.'
          /> 
          <Flash 
            title='📍 Busca prática' 
            paragraph='Encontre prestadores de serviço alimentício com facilidade pelo site.'
          />       
        </div>

        {/* Seção Para quem é o DivulgAí? */}
        <h1 className='lp-flashcontainer-h1'>Para quem é o DivulgAí?</h1>

        {/* Container com Flash cards específicos para prestador e consumidor */}
        <div className="lp-flashcards-second-container">
          
          {/* Card para Prestador */}
          <div className="lp-flashcards-second-container-firstcard">
            <Flash 
              title='👩‍🍳 Sou Prestador' 
              paragraph='Cadastre seus serviços alimentícios e seja encontrado com facilidade.'
            />     
            <Link to='create-perfil' className='lp-flashcards-second-container-secondcard'>
            <button>Quero me cadastrar</button> {/* Aqui poderia ter um Link também */}
            </Link>
          </div>

          {/* Card para Consumidor */}
          <div className="lp-flashcards-second-container-secondcard">
            <Flash 
              title='🍴 Sou Consumidor' 
              paragraph='Encontre opções deliciosas na sua região. Pedidos são feitos diretamente com o prestador.'
            />  
            {/* Link para ir para a página de lista de perfis */}
            <Link to='home-list' className='lp-flashcards-second-container-secondcard'>
              <button>Procure já!</button>   
            </Link>
          </div>
        </div>
      </div>  
    </div>
  );
}
