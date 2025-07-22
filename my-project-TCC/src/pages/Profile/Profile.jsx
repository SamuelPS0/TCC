import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import './Profile.css';
import { FaInstagram, FaFacebook, FaWhatsapp, FaLink, FaPaperclip, FaRegAngry } from "react-icons/fa";

function FeedbackModal({ isOpen, onClose, titulo, setTitulo, mensagem, setMensagem, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="profile-modal" onClick={onClose}>
      <div className='profile-modal-wrapper'>
        <div className='profile-modal-feedback' onClick={(e) => e.stopPropagation()}>
          <h1>Registrar feedback</h1>
          <p>Sua opinião faz a diferença! Compartilhe sua experiência e ajude outras pessoas a descobrirem talentos da culinária.</p>
          <input
            type="text"
            className="profile-modal-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            className="profile-modal-textarea"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            style={{ resize: 'none' }}
          />
          <button type="button" className='profile-modal-button' onClick={onSubmit}>ENVIAR</button>
        </div>
      </div>
    </div>
  );
}

function DenunciaModal({ isOpen, onClose, titulo, setTitulo, mensagem, setMensagem }) {
  if (!isOpen) return null;

  return (
    <div className="profile-modal" onClick={onClose}>
      <div className='profile-modal-wrapper'>
        <div className='profile-modal-denuncia' onClick={(e) => e.stopPropagation()}>
          <h1>Registrar denúncia</h1>
          <p>Registre aqui a sua denúncia e nossa equipe o ajudará assim que possível!</p>
          <input
            type="text"
            className="profile-modal-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            className="profile-modal-textarea"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            style={{ resize: 'none' }}
          />
          <button type="submit" className='profile-modal-button'>ENVIAR</button>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ titulo, mensagem }) {
  const maxTitulo = 30;
  const displayTitulo = titulo.length > maxTitulo ? titulo.slice(0, maxTitulo) + "..." : titulo;
  const maxMensagem = 500;
  const displayMensagem = mensagem.length > maxMensagem ? titulo.slice (0, maxMensagem) + '...' : mensagem;

  return (
    <div className="feedback-card">
      <h2>{displayTitulo}</h2>
      <p>{displayMensagem}</p>
    </div>
  );
}

export default function Perfil() {
  const location = useLocation();
  const perfil = location.state?.perfil;

  const [OpenModal, setOpenModal] = useState(false);
  const [ProfileTitulo, setProfileTitulo] = useState('');
  const [ProfileMensagem, setProfileMensagem] = useState('');

  const [OpenDenunciaModal, setOpenDenunciaModal] = useState(false);
  const [DenunciaTitulo, setDenunciaTitulo] = useState('');
  const [DenunciaMensagem, setDenunciaMensagem] = useState('');

  // Estado para armazenar múltiplos feedbacks
  const [feedbacks, setFeedbacks] = useState([]);

  if (!perfil) {
    return <p>Perfil não encontrado.</p>;
  }

  function enviarFeedback() {
    if (!ProfileTitulo.trim() || !ProfileMensagem.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    setFeedbacks(prev => [...prev, { titulo: ProfileTitulo, mensagem: ProfileMensagem }]);

    setOpenModal(false);
    setProfileTitulo('');
    setProfileMensagem('');
  }

  return (
    <div className='profile-container'>
      <div className="profile-headeronly">
        <Header />
      </div>

      <div className="profile-positioning">
        <div className='profile-main'>
          <div className="profile-header-container">

            {/* PRIMEIRA imagem */}
            {perfil.imagem2 && (
              <div className="profile-images">
                <img
                  src={perfil.imagem2}
                  alt="Imagem 1"
                  className="profile-image"
                />
              </div>
            )}

            {/* RESTANTE DOS CAMPOS */}
            <h1 className='profile-h1'>{perfil.name}</h1>
            <h3 className='profile-h3'>{perfil.description}</h3>

            <div className="profile-main-container-footer">
              <p className='profile-meiocontato'>Meios de contato</p>
            </div>
            <div className="profile-main-container-footer-p2">
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

        {/* SEGUNDA imagem + local */}
        <div className="profile-input-container">
          {perfil.imagem1 && (
            <img
              src={perfil.imagem1}
              alt="Imagem 2"
              className="profile-image-2"
            />
          )}
        </div>
        <div className='profile-buttons'>
          <button onClick={() => setOpenModal(true)} className='profile-feedback'>
            <FaPaperclip className='profile-feedback-icon' />ENVIAR FEEDBACK
          </button>
          <button onClick={() => setOpenDenunciaModal(true)} className='profile-denuncia'>
            <FaRegAngry className='profile-denuncia-icon' />ENVIAR DENÚNCIA
          </button>

          <FeedbackModal
            isOpen={OpenModal}
            onClose={() => setOpenModal(false)}
            titulo={ProfileTitulo}
            setTitulo={setProfileTitulo}
            mensagem={ProfileMensagem}
            setMensagem={setProfileMensagem}
            onSubmit={enviarFeedback}
          />

          <DenunciaModal
            isOpen={OpenDenunciaModal}
            onClose={() => setOpenDenunciaModal(false)}
            titulo={DenunciaTitulo}
            setTitulo={setDenunciaTitulo}
            mensagem={DenunciaMensagem}
            setMensagem={setDenunciaMensagem}
          />
        </div>

        {/* Renderizar todos os cards de feedback */}
        <div className="profile-feedback-card">
          {feedbacks.map((fb, index) => (
            <ProfileCard key={index} titulo={fb.titulo} mensagem={fb.mensagem} />
          ))}
        </div>
      </div>
    </div>
  );
}
