import React, { useState } from 'react'
import HeaderSwitcher from '../../Components/HeaderSwitcher'
import AppStore from '../LandingPage/landingPageImages/appstore.png';
import GooglePlay from '../LandingPage/landingPageImages/googleplay.png';
import LpImage5 from '../LandingPage/landingPageImages/fotosemfundo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaApple, FaGooglePlay  } from 'react-icons/fa';
import './Privacity.css'

const sections = [
  {
    id: 'terms',
    title: 'Termos de Uso',
    content: `
<p><strong>1. Aceitação dos Termos:</strong> Ao utilizar este site e serviços relacionados, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.</p>

<p><strong>2. Acesso e Cadastro:</strong> Para acessar algumas áreas é necessário cadastro. Você é responsável por manter as credenciais seguras e por toda atividade ocorrida na sua conta.</p>

<p><strong>3. Obrigações do Usuário:</strong> Você concorda em fornecer informações verdadeiras e em não utilizar o site para fins ilegais, fraudes, envio de spam ou violação de direitos de terceiros.</p>

<p><strong>4. Conteúdo e Responsabilidades:</strong> O usuário é responsável pelo conteúdo que publicar (comentários, feedbacks, ocorrências). Conteúdo ilícito ou que viole direitos autorais poderá ser removido.</p>

<p><strong>5. Propriedade Intelectual:</strong> Todo material do site (textos, imagens, marca e código) é protegido por direitos autorais. É proibida a reprodução não autorizada.</p>

<p><strong>6. Conduta Proibida:</strong> Não é permitido burlar mecanismos de segurança, fazer engenharia reversa, criar contas falsas ou tentar obter dados de outros usuários sem autorização.</p>

<p><strong>7. Limitação de Responsabilidade:</strong> O site é fornecido "no estado em que se encontra". Na máxima extensão permitida por lei, não nos responsabilizamos por danos indiretos, lucros cessantes ou perdas de dados.</p>

<p><strong>8. Indenização:</strong> Você concorda em indenizar o operador do site por qualquer reclamação decorrente do uso do serviço em violação destes Termos.</p>

<p><strong>9. Rescisão:</strong> Podemos suspender ou encerrar contas que violem estes Termos, sem aviso prévio quando necessário.</p>

<p><strong>10. Alterações:</strong> Reservamo-nos o direito de alterar estes Termos; alterações significativas serão comunicadas quando possível. O uso contínuo após mudanças implica aceitação.</p>

<p><strong>11. Lei Aplicável:</strong> Estes Termos são regidos pelas leis do Brasil e o foro competente será o do domicílio do provedor, salvo disposição em contrário.</p>

<p><strong>12. Contato:</strong> Dúvidas sobre os Termos devem ser enviadas para o canal de suporte ou e-mail indicado no rodapé do site.</p>
    `,
  },
  {
    id: 'privacy',
    title: 'Política de Privacidade',
    content: `
<p><strong>1. Visão Geral:</strong> Esta Política explica quais dados coletamos, por que coletamos e como são tratados e protegidos.</p>

<p><strong>2. Dados que Coletamos:</strong> Dados fornecidos pelo usuário (nome, e-mail, senha, informações de perfil, conteúdo de feedbacks e ocorrências), dados de uso (logs de acesso, páginas visualizadas, interações), dados técnicos (IP, tipo de dispositivo, navegador, geolocalização) e cookies.</p>

<p><strong>3. Finalidades do Tratamento:</strong> Autenticar e gerenciar contas, fornecer e melhorar os serviços, enviar comunicações relacionadas à conta, prevenir fraudes e cumprir obrigações legais.</p>

<p><strong>4. Base Legal:</strong> Consentimento, execução de contrato, obrigação legal e legítimo interesse.</p>

<p><strong>5. Compartilhamento de Dados:</strong> Podemos compartilhar dados com provedores de serviço e autoridades, quando exigido por lei. Não vendemos dados.</p>

<p><strong>6. Segurança:</strong> Adotamos medidas técnicas e organizacionais razoáveis (criptografia, controle de acesso, backups). Nenhum sistema é 100% seguro.</p>

<p><strong>7. Retenção:</strong> Os dados são mantidos enquanto necessários para cumprir as finalidades informadas ou obrigações legais.</p>

<p><strong>8. Direitos do Titular:</strong> Você pode solicitar acesso, correção, exclusão, portabilidade, limitação e oposição ao uso dos dados.</p>

<p><strong>9. Dados de Menores:</strong> O serviço não é destinado a menores de 16 anos. Dados coletados inadvertidamente serão removidos.</p>

<p><strong>10. Alterações na Política:</strong> Podemos atualizar esta Política; alterações relevantes serão comunicadas.</p>

<p><strong>11. Contato:</strong> Dúvidas sobre privacidade: envie um e-mail para o suporte disponível no site.</p>
    `,
  },
]

const Privacity = () => {
  const [open, setOpen] = useState({ terms: true, privacy: true })

  const toggle = (id) => setOpen(prev => ({ ...prev, [id]: !prev[id] }))

  return (
      <main className="privacity-root">
        <HeaderSwitcher />
      <header className="privacity-header">
        <h1>Termos de Uso & Política de Privacidade</h1>
        <p className="subtitle">
          Leia com atenção — contém informações importantes sobre seus direitos e deveres ao usar nossa plataforma.
        </p>
      </header>

      <section className="privacity-sections">
        {sections.map(sec => (
          <article key={sec.id} className="policy-card">
            <button
              className="policy-toggle"
            >
              <h2>{sec.title}</h2>
            </button>

            <div
              id={`${sec.id}-content`}
              className={`policy-content ${open[sec.id] ? 'open' : 'closed'}`}
              dangerouslySetInnerHTML={{ __html: sec.content }}
            />
          </article>
        ))}
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
                  <li><Link to="/privacity">Termos de uso</Link></li>
                  <li><Link to="/privacity">Política de Privacidade</Link></li>
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
  )
}

export default Privacity
