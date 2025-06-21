import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import './Profile.css';
import SearchBar from '../../Components/SearchBar/SearchBar';
import { FaInstagram, FaFacebook, FaWhatsapp, FaLink } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function Perfil() {
  const location = useLocation();
  const perfil = location.state?.perfil;

  if (!perfil) {
    return <p>Perfil não encontrado.</p>;
  }

  return (
    <div className='profile-container'>
      <div className="profile-headeronly">
        <Header/>
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
                              <Icon style={{ fontSize: "40px", marginRight: "8px"}} />
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
      </div>
    </div>
  );
}
