import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import HeaderSwitcher from '../../Components/HeaderSwitcher';
import './ProfilePrestador.css';
import './Modal.css'; // Importando o CSS separado
import { FaInstagram, FaFacebook, FaWhatsapp, FaLink, FaPaperclip, FaRegAngry } from "react-icons/fa";

// MODAL FEEDBACK sem inputs, com 4 quadrados
function FeedbackModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay profilePrestador-modal" onClick={onClose}>

      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <h1>MEUS FEEDBACKS</h1>
        <p>Registre aqui a sua denuncia e nossa equipe o ajudará assim que possível!</p>

        <div className="modal-grid">
          <div className="modal-card">
            <h2>FEEDBACKS 1</h2>
            <p>Texto explicativo breve sobre o feedback 1.</p>
          </div>
          <div className="modal-card">
            <h2>FEEDBACKS 2</h2>
            <p>Texto explicativo breve sobre o feedback 2.</p>
          </div>
          <div className="modal-card">
            <h2>FEEDBACKS 3</h2>
            <p>Texto explicativo breve sobre o feedback 3.</p>
          </div>
          <div className="modal-card">
            <h2>FEEDBACKS 4</h2>
            <p>Texto explicativo breve sobre o feedback 4.</p>
          </div>
        </div>

        <button className="modal-close-btn" onClick={onClose}>FECHAR</button>
      </div>
    </div>
  );
}

// MODAL DENÚNCIA sem inputs, com 4 quadrados
function DenunciaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay profilePrestador-modal" onClick={onClose}>

      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <h1><span className='modal-span'>MINHAS DENÚNCIAS</span></h1>
        <p>Confira abaixo um resumo das denúncias registradas.</p>

        <div className="modal-grid">
          <div className="modal-card">
            <h2>DENÚNCIAS 1</h2>
            <p>Texto explicativo breve sobre a denúncia 1.</p>
          </div>
          <div className="modal-card">
            <h2>DENÚNCIAS 2</h2>
            <p>Texto explicativo breve sobre a denúncia 2.</p>
          </div>
          <div className="modal-card">
            <h2>DENÚNCIAS 3</h2>
            <p>Texto explicativo breve sobre a denúncia 3.</p>
          </div>
          <div className="modal-card">
            <h2>DENÚNCIAS 4</h2>
            <p>Texto explicativo breve sobre a denúncia 4.</p>
          </div>
        </div>

        <button className="modal-close-btn" onClick={onClose}>FECHAR</button>
      </div>
    </div>
  );
}

function ProfilePrestadorCard({ titulo, mensagem }) {
  const maxTitulo = 30;
  const displayTitulo = titulo.length > maxTitulo ? titulo.slice(0, maxTitulo) + "..." : titulo;
  const maxMensagem = 500;
  const displayMensagem = mensagem.length > maxMensagem ? mensagem.slice(0, maxMensagem) + '...' : mensagem;

  return (
    <div className="feedback-card">
      <h2>{displayTitulo}</h2>
      <p>{displayMensagem}</p>
    </div>
  );
}

const ProfilePrestador = () => {
  const location = useLocation();
  const perfil = location.state?.perfil;
  const openTarget = location.state?.open;

  const [OpenModal, setOpenModal] = useState(false);
  const [OpenDenunciaModal, setOpenDenunciaModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
    if (openTarget === 'denuncias') {
      setOpenDenunciaModal(true);
    } else if (openTarget === 'feedbacks') {
      setOpenModal(true);
    }
  }, [openTarget]);

  if (!perfil) {
    return <p>Perfil não encontrado.</p>;
  }

  return (
    <div>
      <HeaderSwitcher />
      <div className='profilePrestador-container'>
        <div className="profilePrestador-positioning">
          <Link to="/">← VOLTAR</Link>
          <div className='profilePrestador-main'>
            <div className="profilePrestador-header-container">
              {perfil.imagem2 && (
                <div className="profilePrestador-images">
                  <img src={perfil.imagem2} alt="Imagem 1" className="profilePrestador-image" />
                </div>
              )}
              <h1 className='profilePrestador-h1'>{perfil.name}</h1>
              <h3 className='profilePrestador-h3'>{perfil.description}</h3>

              <div className="profilePrestador-main-container-footer">
                <p className='profilePrestador-meiocontato'>Meios de contato</p>
              </div>
              <div className="profilePrestador-main-container-footer-p2">
                {perfil.contacts && perfil.contacts.map((c, i) => {
                  let Icon;
                  let color = "#333";

                  switch (c.label.toLowerCase()) {
                    case "instagram":
                      Icon = FaInstagram;
                      color = "#E4405F";
                      break;
                    case "facebook":
                      Icon = FaFacebook;
                      color = "#1877F2";
                      break;
                    case "whatsapp":
                      Icon = FaWhatsapp;
                      color = "#25D366";
                      break;
                    default:
                      Icon = FaLink;
                      color = "#555";
                  }

                  return (
                    <a
                      key={i}
                      href={c.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                      style={{ color }}
                    >
                      <Icon style={{ fontSize: "40px", marginRight: "8px" }} />
                      {c.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="profilePrestador-input-container">
            {perfil.imagem1 && (
              <img src={perfil.imagem1} alt="Imagem 2" className="profilePrestador-image-2" />
            )}
          </div>

          <div className='profilePrestador-buttons'>
            <button onClick={() => setOpenModal(true)} className='profilePrestador-feedback'>
              <FaPaperclip className='profilePrestador-feedback-icon' />MEUS FEEDBACKS
            </button>
            <button onClick={() => setOpenDenunciaModal(true)} className='profilePrestador-denuncia'>
              <FaRegAngry className='profilePrestador-denuncia-icon' />MINHAS DENÚNCIAS
            </button>

            <FeedbackModal
              isOpen={OpenModal}
              onClose={() => setOpenModal(false)}
            />

            <DenunciaModal
              isOpen={OpenDenunciaModal}
              onClose={() => setOpenDenunciaModal(false)}
            />
          </div>

          <div className="profilePrestador-feedback-card">
            {feedbacks.map((fb, index) => (
              <ProfilePrestadorCard key={index} titulo={fb.titulo} mensagem={fb.mensagem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePrestador;
