import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaInstagram, FaFacebook, FaWhatsapp, FaLink, FaPaperclip, FaRegAngry } from "react-icons/fa";
import ProfileImg from "../../img/Ellipse.png";
import InputImg from "../../img/crosant.png";
import HeaderSwitcher from '../../Components/HeaderSwitcher';
import "./Profile.css";

// Modal de Feedback

const FeedbackModal = ({ isOpen, onClose, titulo, setTitulo, mensagem, setMensagem, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="profile-modal" onClick={onClose}>
      <div className="profile-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-feedback">
          <h1>Registrar feedback</h1>
          <p>Sua opinião faz a diferença! Compartilhe sua experiência e ajude outras pessoas a descobrirem talentos da culinária.</p>
          <input
            type="text"
            className="profile-modal-input"
            placeholder="Título do feedback"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            className="profile-modal-textarea"
            placeholder="Escreva seu feedback"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            style={{ resize: 'none' }}
          />
          <button type="button" className="profile-modal-button" onClick={onSubmit}>ENVIAR</button>
        </div>
      </div>
    </div>
  );
};

// Modal de Denúncia
const DenunciaModal = ({ isOpen, onClose, titulo, setTitulo, mensagem, setMensagem, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="profile-modal" onClick={onClose}>
      <div className="profile-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-denuncia">
          <h1>Registrar denúncia</h1>
          <p>Registre aqui a sua denúncia e nossa equipe o ajudará assim que possível!</p>
          <input
            type="text"
            className="profile-modal-input"
            placeholder="Título da denúncia"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            className="profile-modal-textarea"
            placeholder="Descreva a denúncia"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            style={{ resize: 'none' }}
          />
          <button type="button" className="profile-modal-button" onClick={onSubmit}>ENVIAR</button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const location = useLocation();
  const dados = location.state?.perfil;

  // Estados dos modais
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openDenuncia, setOpenDenuncia] = useState(false);

  // Estados dos inputs
  const [feedbackTitulo, setFeedbackTitulo] = useState('');
  const [feedbackMensagem, setFeedbackMensagem] = useState('');
  const [denunciaTitulo, setDenunciaTitulo] = useState('');
  const [denunciaMensagem, setDenunciaMensagem] = useState('');

  if (!dados) return <p>Carregando perfil...</p>;

  const getContatoIcon = (link) => {
    if (!link) return <FaLink />;
    if (link.includes("instagram.com")) return <FaInstagram />;
    if (link.includes("facebook.com")) return <FaFacebook />;
    if (link.includes("wa.me") || link.includes("whatsapp.com")) return <FaWhatsapp />;
    return <FaLink />;
  };

  const enviarFeedback = () => {
    console.log("Feedback enviado:", feedbackTitulo, feedbackMensagem);
    setFeedbackTitulo('');
    setFeedbackMensagem('');
    setOpenFeedback(false);
  };

  const enviarDenuncia = () => {
    console.log("Denúncia enviada:", denunciaTitulo, denunciaMensagem);
    setDenunciaTitulo('');
    setDenunciaMensagem('');
    setOpenDenuncia(false);
  };
console.log('Dados recebidos:',dados)
console.log('Titulo do feedback:',dados.feedbackTitulo)
console.log('Descricao do feedback:',dados.feedbackDescricao)
  return (
    <>
      <HeaderSwitcher />
      <div className="profile-container">
        <div className="profile-positioning">
          <div className="profile-main">
            <div className="profile-header-container">
              <div className="profile-images">
                <img src={ProfileImg} alt="Imagem do serviço" className="profile-image" />
              </div>
              <h1 className="profile-h1">{dados.servicoNome}</h1>
              <h3 className="profile-h3">{dados.servicoDescricao}</h3>
            </div>

            <div className="profile-main-container-footer">
              <p className="profile-meiocontato">Meios de contato</p>
            </div>

            <div className="profile-main-container-footer-p2">
              {dados.contatoMidia && (
                <a
                  href={dados.contatoMidia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  style={{ color: "#E4405F" }}
                >
                  {getContatoIcon(dados.contatoMidia)} Instagram
                </a>
              )}
            </div>
          </div>

          <div className="profile-input-container">
            <img src={InputImg} alt="Imagem do serviço" className="profile-image-2" />
          </div>

          <div className="profile-buttons">
            <button onClick={() => setOpenFeedback(true)} className="profile-feedback">
              <FaPaperclip className="profile-feedback-icon" /> ENVIAR FEEDBACK
            </button>
            <button onClick={() => setOpenDenuncia(true)} className="profile-denuncia">
              <FaRegAngry className="profile-denuncia-icon" /> ENVIAR DENÚNCIA
            </button>
          </div>

          <div className="profile-feedback-card">
            <div className="feedback-card">
          
              <h2>{dados.feedbackTitulo}</h2>
              <p>{dados.feedbackDescricao}</p>
            </div>
          </div>

          {/* Modais */}
          <FeedbackModal
            isOpen={openFeedback}
            onClose={() => setOpenFeedback(false)}
            titulo={feedbackTitulo}
            setTitulo={setFeedbackTitulo}
            mensagem={feedbackMensagem}
            setMensagem={setFeedbackMensagem}
            onSubmit={enviarFeedback}
          />

          <DenunciaModal
            isOpen={openDenuncia}
            onClose={() => setOpenDenuncia(false)}
            titulo={denunciaTitulo}
            setTitulo={setDenunciaTitulo}
            mensagem={denunciaMensagem}
            setMensagem={setDenunciaMensagem}
            onSubmit={enviarDenuncia}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
