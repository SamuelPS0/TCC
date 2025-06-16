import React from 'react';
import './LandingPage.css';
import Flash from '../../Components/Flash/Flash';
import SearchBar from '../../Components/SearchBar/SearchBar';
import LogoLP from '../../img/divulgai-logo-branca.png';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <div className="lp-allpage-container">
        <div className="lp-header">
      <img className='lp-img-header' src={LogoLP} alt="Logo DivulgAí" />
        </div>
      <SearchBar shouldNavigate={true} />
      <h1 className='lp-h1'>🍽️ Sobre nós</h1>
      <p className="lp-p">
        O DivulgAí é uma plataforma digital feita para conectar consumidores
        a prestadores de serviços locais do ramo da alimentação de forma simples, prática e direta.
        Aqui, você encontra aquele sabor caseiro feito com carinho, de pessoas que estão bem perto de você.
        Nosso objetivo é valorizar os pequenos negócios, fortalecer a economia local e facilitar a divulgação  
        de produtos alimentícios sem burocracia. No Divulgaí, você busca e encontra quem faz — e quem faz, se
         conecta com quem quer provar!
         </p>

      <h1 className='lp-flashcontainer-h1'>Por que usar o DivulgAí?</h1>
    <div className="lp-flashcards-container">
            <Flash 
      title='🍲 Comida caseira' 
      paragraph='Sabores autênticos feitos por quem entende de comida de verdade.'
      />  
            <Flash 
      title='🤝 Apoie o local' 
      paragraph='Valorize os pequenos negócio e fortaleça a economia do seu bairro.'
      /> 
            <Flash 
      title='📍 Busca prática' 
      paragraph='Encontre prestadores de serviço alimentício com facilidade pelo site.'
      />       
      </div>
        <h1 className='lp-flashcontainer-h1'>Para quem é o DivulgAí?</h1>
          <div className="lp-flashcards-second-container">
            <div className="lp-flashcards-second-container-firstcard">
                  <Flash 
      title='👩‍🍳 Sou Prestador' 
      paragraph='Cadastre seus serviços alimentícios e seja encontrado com facilidade.'
      />     
      <button>Quero me cadastrar</button>
      </div>
      
      <div className="lp-flashcards-second-container-secondcard">
                  <Flash 
      title='🍴 Sou Consumidor' 
      paragraph='Encontre opções deliciosas na sua região. Pedidos são feitos diretamente com o prestador.'
      />  
      <Link to='home-list' className='lp-flashcards-second-container-secondcard'>
      <button>Procure já!</button>   
      </Link>
      </div>
      </div>
    </div>  
    </div>
  );
}
