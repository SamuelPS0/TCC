import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaInstagram, FaFacebook, FaWhatsapp, FaLink, FaPaperclip, FaRegAngry } from "react-icons/fa";
import ProfileImg from "../../img/Ellipse.png";
import ProfileImg2 from "../../img/pererinha.png";
import InputImg from "../../img/crosant.png";
import InputImg2 from "../../img/bebidas.jpg";
import HeaderSwitcher from "../../Components/HeaderSwitcher";
import Loading from "../../Components/Loading/Loading";
import { useAuth } from "../../Components/AuthContext";
import "./Profile.css";

const Profile = () => {
  const location = useLocation();
  const dados = location.state?.perfil;
  const { user } = useAuth();

  // hooks
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openDenuncia, setOpenDenuncia] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  
  // loader
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // inicia fade-out
      setTimeout(() => setShowLoader(false), 500); // remove do DOM após 0.5s
    }, 2000); // tempo do "loader fake"
    return () => clearTimeout(timer);
  }, []);

  // Busca feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/feedback");
        const feedbacksPrestador = res.data.filter(
          (f) => Number(f.prestadorId) === Number(dados?.prestadorId) && f.tipoFeedback === "FEEDBACK"
        );
        setFeedbacks(feedbacksPrestador);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
      }
    };
    if (dados) fetchFeedbacks();
  }, [dados]);

  const getContatoIcon = (link) => {
    if (!link) return <FaLink />;
    if (link.includes("instagram.com")) return <FaInstagram />;
    if (link.includes("facebook.com")) return <FaFacebook />;
    if (link.includes("wa.me") || link.includes("whatsapp.com")) return <FaWhatsapp />;
    return <FaLink />;
  };

  const getFotosPrestador = (id) => {
    if (id === 1) return { perfil: ProfileImg, servico: InputImg };
    if (id === 2) return { perfil: ProfileImg2, servico: InputImg2 };
    return { perfil: ProfileImg, servico: InputImg };
  };

  const fotos = dados ? getFotosPrestador(dados.prestadorId) : { perfil: "", servico: "" };

  const FeedbackDenunciaModal = ({ isOpen, onClose, tipo }) => {
    const [titulo, setTitulo] = useState("");
    const [mensagem, setMensagem] = useState("");

    const enviar = async () => {
      if (!titulo || !mensagem) {
        alert("Preencha todos os campos!");
        return;
      }
      const payload = {
        titulo,
        descricao: mensagem,
        tipoFeedback: tipo,
        usuarioId: user?.id,
        prestadorId: dados.prestadorId,
        dataCadastro: new Date().toISOString(),
        statusFeedback: "ATIVO",
      };
      try {
        await axios.post("http://localhost:8080/api/v1/feedback", payload);
        setTitulo(""); setMensagem(""); onClose();
        setFeedbacks((prev) => [...prev, payload]);
      } catch (error) {
        console.error(error);
        alert("Erro ao enviar!");
      }
    };

    if (!isOpen) return null;

    return (
      <div className="profile-modal" onClick={(e) => e.target.className === "profile-modal" && onClose()}>
        <div className="profile-modal-wrapper">
          <div className="profile-modal-feedback">
            <button
              onClick={onClose}
              style={{ float: "right", background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}
            >
              ×
            </button>
            <h1>{tipo === "FEEDBACK" ? "Registrar Feedback" : "Registrar Denúncia"}</h1>
            <p>{tipo === "FEEDBACK" ? "Sua opinião faz a diferença!" : "Registre sua denúncia aqui."}</p>
            <input
              type="text"
              className="profile-modal-input"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <textarea
              className="profile-modal-textarea"
              placeholder={tipo === "FEEDBACK" ? "Escreva seu feedback" : "Descreva a denúncia"}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              style={{ resize: "none" }}
            />
            <button className="profile-modal-button" onClick={enviar}>
              ENVIAR
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showLoader && <Loading fadeOut={fadeOut} />}
      {!showLoader && (
        <>
          <HeaderSwitcher />
          <div className="profile-container">
            <div className="profile-positioning">
              <div className="profile-main">
                <div className="profile-header-container">
                  <div className="profile-images">
                    <img src={fotos.perfil} alt="Imagem do prestador" className="profile-image" />
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
                      className={`contact-link ${
                        dados.contatoMidia.includes("instagram.com")
                          ? "instagram"
                          : dados.contatoMidia.includes("facebook.com")
                          ? "facebook"
                          : dados.contatoMidia.includes("wa.me") || dados.contatoMidia.includes("whatsapp.com")
                          ? "whatsapp"
                          : ""
                      }`}
                    >
                      {getContatoIcon(dados.contatoMidia)}{" "}
                      {dados.contatoMidia.includes("instagram.com")
                        ? "Instagram"
                        : dados.contatoMidia.includes("facebook.com")
                        ? "Facebook"
                        : dados.contatoMidia.includes("wa.me") || dados.contatoMidia.includes("whatsapp.com")
                        ? "WhatsApp"
                        : "Link"}
                    </a>
                  )}
                </div>
              </div>

              <div className="profile-input-container">
                <img src={fotos.servico} alt="Imagem do serviço" className="profile-image-2" />
              </div>

              <div className="profile-buttons">
                <button onClick={() => setOpenFeedback(true)} className="profile-feedback">
                  <FaPaperclip className="profile-feedback-icon" /> ENVIAR FEEDBACK
                </button>
                <button onClick={() => setOpenDenuncia(true)} className="profile-denuncia">
                  <FaRegAngry className="profile-denuncia-icon" /> ENVIAR DENÚNCIA
                </button>
              </div>

              {feedbacks.length > 0 ? (
                <div className="profile-feedback-card">
                  {feedbacks.map((fb, index) => (
                    <div className="feedback-card-lenght" key={index}>
                      <h2>{fb.titulo}</h2>
                      <p>{fb.descricao}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ marginTop: "20px" }}>Sem feedbacks ainda.</p>
              )}

              <FeedbackDenunciaModal isOpen={openFeedback} onClose={() => setOpenFeedback(false)} tipo="FEEDBACK" />
              <FeedbackDenunciaModal isOpen={openDenuncia} onClose={() => setOpenDenuncia(false)} tipo="DENUNCIA" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
