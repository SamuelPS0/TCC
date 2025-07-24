import React from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import HeaderCliente from '../../Components/Header/levelHeaders/HeaderCliente';
import HeaderPrestador from '../../Components/Header/levelHeaders/HeaderPrestador';
import Header0 from '../../Components/Header/levelHeaders/Header0';
import accessLevels from '../../Components/accessLevels';
import SearchBar from '../../Components/SearchBar/SearchBar';
import LogoFundoBranco from '../../img/logoParaFundoBranco.png';
import Register from '../Register/Register';
import LpImage1 from '../LandingPage/landingPageImages/sauteeing-food.jpg'
import LpImage2 from '../LandingPage/landingPageImages/chef-masculino-cozinhando-na-cozinha.jpg'
import LpImage3 from '../LandingPage/landingPageImages/woman-working-as-professional-chef.jpg'
import LpImage4 from '../LandingPage/landingPageImages/peneira-de-mulher-flor-na-tigela-para-fazer-bolo.jpg'
import '../LandingPage/LandingPage.css'

export default function LandingPage() {
    const { user } = useAuth();
    

  return (
    <div className='lp'>
{user?.accessLevel === accessLevels.CLIENTE && <HeaderCliente />}
{user?.accessLevel === accessLevels.PRESTADOR && <HeaderPrestador />}
{user?.accessLevel === accessLevels.GUEST && <Header0 />}
{!user && <Header0 />}

          <main >
            <section className='lp-section'>
              <h1 className='lp-first-section-h1'>
                ENCONTRE OS MELHORES PROFISSIONAIS<br/>DA <span>GASTRONOMIA</span> NA SUA REGIÃO!
              </h1>
              <h3 className='lp-first-section-h3'>
                Com a <span>DivulgAí</span>, os melhores sabores da sua região<br/> estão a apenas um clique. Experimente agora!
              </h3>
              
              <SearchBar shouldNavigate = {true}/>
            </section>

            <article className='lp-full-article'>
            <div className= 'lp-article'>
               <img src={LogoFundoBranco} alt="Logo DivulgAí" className='lp-logo-img'/>
               <div className='lp-article-container'>
               <h1 className='lp-article-h1'>Nossa Missão</h1>
               <p>Queremos dar visibilidade aos pequenos prestadores da área da culinária, facilitando o acesso dos consumidores a refeições autênticas, feitas com <span>dedicação</span> e <span>sabor</span>.</p>
               <div className='lp-article-line'></div>
               <p>Acreditamos que todo prato conta uma história — e estamos aqui para ajudar essas histórias a <span>chegarem mais longe</span>.</p> 
              </div>
            </div>
            </article>

            <section>
              <div className='lp-section2-container'>
              <div className='lp-section2-container-text'>
              <h4 className='lp-section2-h4'>SUA PRÓXIMA <span>EXPERIÊNCIA</span><br /> COMEÇA AQUI</h4>
              <h2 className='lp-section2-h2'>DE MARMITAS A BOLOS ARTESANAIS, ENCONTRE <span className='lp-span-section2-edit'>PROFISSIONAIS AUTÔNOMOS</span> QUE COZINHAM COM DEDICAÇÃO NA SUA REGIÃO.</h2>
              </div>
              <div className='lp-section2-img-container'>
              <div className='lp-section2-img-container-p1'>
              <img src={LpImage1} alt="Pessoa cozinhando" className='lp-section2-img'/>
              <img src={LpImage2} alt="Pessoa cozinhando" className='lp-section2-img'/>
              </div>
              <div className='lp-section2-img-container-p2'>
              <img src={LpImage3} alt="Pessoa cozinhando" className='lp-section2-img'/>
              <img src={LpImage4} alt="Pessoa cozinhando" className='lp-section2-img'/>
              </div>
              </div>
              </div>
            </section>

            <section>
            <div className='lp-section3-cards'>
              <div className="lp-bodyCard">
              <h1>Pra quem ama comer</h1>
              <div className='lp-bodyCard-Container'>
                <p>Para suas festas, ceias e encontros especiais, descubra pratos caseiros preparados com carinho por quem vive a gastronomia.</p>
                  <Link to="/home-list" className="lp-bodyCard-button">
                  Sou Cliente
                </Link>
              </div>
              </div>

              <div className="lp-bodyCard">
              <h1>Pra quem ama cozinhar</h1>
              <div className='lp-bodyCard-Container'>
                <p>Divulgue seu serviço, alcance mais pessoas e transforme sua paixão pela cozinha em renda.<br/>­</p>
                <Link to="/register" className="lp-bodyCard-button">
                  Sou Cozinheiro
                </Link>

              </div>
              </div>
              </div>
            </section>

            <footer>
              <div className='lp-footer'>
                <div className = 'lp-footer-section1'>
                  <h1 className='lp-footer-section1-h1'>Divulgaí</h1>
                  <p>Somos uma plataforma que valoriza o trabalho dos pequenos profissionais da culinária, aproximando você de pratos feitos com carinho e autenticidade.</p>
                </div>
                <div className='lp-footer-section2'>
                  <h1>Links úteis</h1>
                  <ul>
                    <li>Sobre Nós</li>
                    <li>Buscar Prestadores</li>
                    <li>Cadastro</li>
                    <li>Login</li>
                  </ul>
                </div>
                <div className='lp-footer-section3'>
                  <h1>Social</h1>
                  <ul>
                    <li>Instagram</li>
                    <li>Facebook</li>
                    <Link to="/create-perfil">
                    <li>Email</li></Link>
                    <Link to='apagar'>
                    <li>Telefone</li>
                    </Link>
                  </ul>
                </div>
                </div>
            </footer>
            </main>
    </div>
  )
}
