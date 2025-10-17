// src/pages/Profile/Profile.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import ProfileImg from "../../img/image.png";
import { FaInstagram, FaFacebook, FaWhatsapp, FaLink } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const location = useLocation();
  const dados = location.state?.perfil;

  if (!dados) return <p>Carregando perfil...</p>;

  const tipoContato = dados.contatoTipo?.toLowerCase() || "outro";
  const cor =
    tipoContato === "instagram"
      ? "#E4405F"
      : tipoContato === "facebook"
      ? "#1877F2"
      : tipoContato === "whatsapp"
      ? "#25D366"
      : "#555";

  return (
    <div className="profile-container">
      <div className="profile-main">
        <div className="profile-header-container">
          <div className="profile-images">
            <img src={ProfileImg} alt="Imagem do serviço" className="profile-image"/>
          </div>

          <h1 className="profile-h1">{dados.servicoNome}</h1>
          <h3 className="profile-h3">{dados.servicoDescricao}</h3>

          {dados.contatoLink && (
            <a href={dados.contatoLink} target="_blank" rel="noopener noreferrer" style={{ color: cor }}>
              {tipoContato === "instagram" && <FaInstagram />}
              {tipoContato === "facebook" && <FaFacebook />}
              {tipoContato === "whatsapp" && <FaWhatsapp />}
              {tipoContato === "outro" && <FaLink />}
              {" "}{tipoContato.charAt(0).toUpperCase() + tipoContato.slice(1)}
            </a>
          )}

          <div className="profile-feedback-card">
            <h2>{dados.feedbackTitulo}</h2>
            <p>{dados.feedbackDescricao}</p>
          </div>

          <p><strong>Categoria:</strong> {dados.categoria}</p>
          <p><strong>Localização:</strong> {dados.cidade} - {dados.uf}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
