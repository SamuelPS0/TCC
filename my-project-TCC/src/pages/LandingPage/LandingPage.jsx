// LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import HeaderCliente from '../../Components/Header/levelHeaders/HeaderCliente';
import HeaderPrestador from '../../Components/Header/levelHeaders/HeaderPrestador';
import HeaderAdmin from '../../Components/Header/levelHeaders/HeaderAdmin';
import Header0 from '../../Components/Header/levelHeaders/Header0';
import accessLevels from '../../Components/accessLevels';
import SearchBar from '../../Components/SearchBar/SearchBar';
import LogoFundoBranco from '../../img/logoParaFundoBranco.png';
import LpImage1 from '../LandingPage/landingPageImages/4.png';
import LpImage2 from '../LandingPage/landingPageImages/2.png';
import LpImage3 from '../LandingPage/landingPageImages/3.png';
import LpImage4 from '../LandingPage/landingPageImages/1.png';
import LpImage5 from '../LandingPage/landingPageImages/fotosemfundo.png';
import AppStore from '../LandingPage/landingPageImages/appstore.png';
import GooglePlay from '../LandingPage/landingPageImages/googleplay.png';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaApple, FaGooglePlay  } from 'react-icons/fa';
import '../LandingPage/LandingPage.css';


export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="lp">
      {user?.accessLevel === accessLevels.CLIENTE && <HeaderCliente />}
      {user?.accessLevel === accessLevels.PRESTADOR && <HeaderPrestador />}
      {user?.accessLevel === accessLevels.ADMIN && <HeaderAdmin />}
      {user?.accessLevel === accessLevels.GUEST && <Header0 />}
      {!user && <Header0 />}

      <main>
        <section className="lp-section">
          <h1 className="lp-first-section-h1" id='scrollone'>
            ENCONTRE OS MELHORES PROFISSIONAIS<br />DA <span>GASTRONOMIA</span> NA SUA REGIÃO!
          </h1>
          <h3 className="lp-first-section-h3">
            Com a <span>DivulgAí</span>, os melhores sabores da sua região<br /> estão a apenas um clique. Experimente agora!
          </h3>
          <SearchBar shouldNavigate={true} />
        </section>

        <article className="lp-full-article">
          <div className="lp-article">
            <img src={LogoFundoBranco} alt="Logo DivulgAí" className="lp-logo-img" />
            <div className="lp-article-container">
              <h1 className="lp-article-h1" id='scrolltwo'>Nossa Missão</h1>
              <p>
                Queremos dar visibilidade aos pequenos prestadores da área da culinária, facilitando o acesso dos consumidores a refeições autênticas, feitas com <span>dedicação</span> e <span>sabor</span>.
              </p>
              <div className="lp-article-line"></div>
              <p>
                Acreditamos que todo prato conta uma história — e estamos aqui para ajudar essas histórias a <span>chegarem mais longe</span>.
              </p>
            </div>
          </div>
        </article>

        <section>
          <div className="lp-section2-container">
            <div className="lp-section2-container-text">
              <h4 className="lp-section2-h4" id='scrollthree'>SUA PRÓXIMA <span>EXPERIÊNCIA</span><br /> COMEÇA AQUI</h4>
              <h2 className="lp-section2-h2">
                DE MARMITAS A BOLOS ARTESANAIS, ENCONTRE <span className="lp-span-section2-edit">PROFISSIONAIS AUTÔNOMOS</span> QUE COZINHAM COM DEDICAÇÃO NA SUA REGIÃO.
              </h2>
            </div>
            <div className="lp-section2-img-container">
              <div className="lp-section2-img-container-p1">
                <img src={LpImage1} alt="Pessoa cozinhando" className="lp-section2-img" />
                <img src={LpImage2} alt="Pessoa cozinhando" className="lp-section2-img" />
              </div>
              <div className="lp-section2-img-container-p2">
                <img src={LpImage3} alt="Pessoa cozinhando" className="lp-section2-img" />
                <img src={LpImage4} alt="Pessoa cozinhando" className="lp-section2-img" />
              </div>
            </div>
          </div>
        </section>

     <footer className="footer">
      <div className="footer-top">
        <div className="footer-social">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaLinkedinIn /></a>
          <a href="#"><FaTwitter /></a>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col brand">
          <img src={LpImage5} alt="Logo DivulgAí" className="footer-logo" />
          <div className="app-buttons">
            <img src={GooglePlay} alt="Google Play" className='play'/>
            <img src={AppStore} alt="App Store" className='apple'/>
          </div>
        </div>

        <div className="footer-col">
          <h4>Sobre Nós</h4>
          <ul>
            <li><a href='#scrollone'>Quem somos</a></li>
            <li><a href="#scrolltwo">Nossa Missão</a></li>
            <li><a href="#scrollthree">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Links</h4>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/contato">Contato</Link></li>
            <li><Link to="/politica">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contato</h4>
          <p>Rua Exemplo 123, São Paulo - SP</p>
          <p>contato@divulgai.com</p>
          <p>(11) 90000-0000</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DivulgAí — Todos os direitos reservados.</p>
      </div>
    </footer>
      </main>
    </div>
  );
}
