import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaLink,
  FaPaperclip,
  FaRegAngry,
  FaStar,
  FaRegStar,
  FaRegUser,
  FaPen,
  FaShieldAlt,
  FaExclamationTriangle,
  FaRegCommentDots,
  FaLock,
  FaCheckCircle,
  FaRegFlag
} from "react-icons/fa";
import { MdStars } from "react-icons/md";
import ProfileImg from "../../img/Ellipse.png";
import InputImg from "../../img/crosant.png";
import HeaderSwitcher from "../../Components/HeaderSwitcher";
import Loading from "../../Components/Loading/Loading";
import { useAuth } from "../../Components/AuthContext";
import { toast } from "sonner";
import "./Profile.css";
import { breakLineEveryNChars } from "../../utils/formatFeedbackText";

const getContatoPrestadorId = (contato = {}) =>
  Number(contato.prestadorId ?? contato.prestador_id ?? contato.prestador?.id);

const contatoEstaAtivo = (contato = {}) =>
  String(contato.statusContato ?? contato.status_contato ?? "ATIVO").toUpperCase() === "ATIVO";

const getNomeFeedback = (feedback = {}, nomesUsuarios = {}) =>
  feedback.nomeUsuario ||
  nomesUsuarios[Number(feedback.usuarioId)] ||
  `Usuário #${feedback.usuarioId || ""}`.trim();

const getInicialFeedback = (nome = "") =>
  nome.trim().charAt(0).toUpperCase() || "?";

const formatNotaFeedback = (nota) => {
  const notaNumerica = Number(nota);

  if (!notaNumerica) {
    return "Sem nota";
  }

  return "";
};

const formatTempoFeedback = (dataCadastro) => {
  if (!dataCadastro) {
    return "Agora";
  }

  const data = new Date(dataCadastro);

  if (Number.isNaN(data.getTime())) {
    return "Agora";
  }

  const diferencaMinutos = Math.max(
    0,
    Math.floor((Date.now() - data.getTime()) / 60000)
  );

  if (diferencaMinutos < 1) return "Agora";
  if (diferencaMinutos < 60) return `Há ${diferencaMinutos} min`;

  const diferencaHoras = Math.floor(diferencaMinutos / 60);
  if (diferencaHoras < 24) return `Há ${diferencaHoras} h`;

  const diferencaDias = Math.floor(diferencaHoras / 24);
  if (diferencaDias < 30) return `Há ${diferencaDias} d`;

  return data.toLocaleDateString("pt-BR");
};

const Profile = () => {
  const location = useLocation();
  const dados = location.state?.perfil;
  const { user } = useAuth();

  const [openFeedback, setOpenFeedback] = useState(false);
  const [openDenuncia, setOpenDenuncia] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [nomesUsuarios, setNomesUsuarios] = useState({});
  const [contatos, setContatos] = useState([]);

  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    console.log("🔎 Dados recebidos do card:", dados);
  }, [dados]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const buscarNomeUsuarioPorId = async (usuarioId) => {
    try {
      console.log("Buscando usuário:", usuarioId);

      const res = await axios.get(`http://localhost:8080/api/v1/Usuario/${usuarioId}`);

      console.log("Resposta da API:", res.data);

      return res.data?.nome || `Usuário #${usuarioId}`;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${usuarioId}:`, error);
      return `Usuário #${usuarioId}`;
    }
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/feedback");

        const feedbacksPrestador = res.data.filter(
          (f) =>
            Number(f.prestadorId) === Number(dados?.prestadorId) &&
            f.tipoFeedback === "FEEDBACK" &&
            f.statusFeedback === "ATIVO"
        );

        const idsUsuarios = [
          ...new Set(feedbacksPrestador.map((f) => f.usuarioId).filter(Boolean)),
        ];

        const nomesArray = await Promise.all(
          idsUsuarios.map(async (id) => [
            Number(id),
            await buscarNomeUsuarioPorId(id),
          ])
        );

        setNomesUsuarios(Object.fromEntries(nomesArray));
        setFeedbacks(feedbacksPrestador);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
      }
    };

    if (dados) {
      fetchFeedbacks();
    }
  }, [dados]);

  const normalizeContatoTipo = (contato = {}) =>
    String(
      contato.tipoContato ??
        contato.tipo_contato ??
        contato.tipo ??
        contato.label ??
        "Link"
    )
      .trim()
      .toLowerCase();

  const getContatoInfo = (contato = {}) => {
    const tipo = normalizeContatoTipo(contato);

    if (tipo === "instagram") {
      return {
        Icon: FaInstagram,
        label: "Instagram",
        className: "instagram",
      };
    }

    if (tipo === "facebook") {
      return {
        Icon: FaFacebook,
        label: "Facebook",
        className: "facebook",
      };
    }

    if (tipo === "whatsapp") {
      return {
        Icon: FaWhatsapp,
        label: "WhatsApp",
        className: "whatsapp",
      };
    }

    return {
      Icon: FaLink,
      label: contato.label || contato.tipoContato || contato.tipo_contato || "Link",
      className: "",
    };
  };

  const getContatoHref = (contato = {}) => {
    const link = contato.link ?? contato.value ?? contato.url ?? contato;

    if (typeof link !== "string") return "#";

    const trimmedLink = link.trim();

    if (!trimmedLink) return "#";

    if (/^(https?:)?\/\//i.test(trimmedLink) || /^(mailto:|tel:)/i.test(trimmedLink)) {
      return trimmedLink;
    }

    return `https://${trimmedLink}`;
  };

  useEffect(() => {
    const fetchContatos = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/contato");

        const contatosPrestador = (res.data || []).filter(
          (contato) =>
            getContatoPrestadorId(contato) === Number(dados?.prestadorId) &&
            contatoEstaAtivo(contato)
        );

        setContatos(contatosPrestador);
      } catch (error) {
        console.error("Erro ao buscar contatos do prestador:", error);
        setContatos([]);
      }
    };

    if (dados?.prestadorId) {
      fetchContatos();
    } else {
      setContatos([]);
    }
  }, [dados?.prestadorId]);

  const getFotosPrestador = (dadosPrestador) => {
    if (!dadosPrestador) {
      return {
        perfil: "",
        servico: "",
      };
    }

    const prestadorId = Number(dadosPrestador.prestadorId);

    console.debug("[Profile] Selecionando fotos do prestador:", {
      prestadorId,
      temImagemPerfil: Boolean(dadosPrestador.imagemPerfil),
      temImagemServico: Boolean(dadosPrestador.imagemServico),
    });

    if (prestadorId === 1) {
      return {
        perfil: ProfileImg,
        servico: InputImg,
      };
    }

    return {
      perfil: dadosPrestador.imagemPerfil || ProfileImg,
      servico: dadosPrestador.imagemServico || InputImg,
    };
  };

  const feedbacksAtivos = feedbacks.filter(
    (fb) => fb.statusFeedback?.toUpperCase() === "ATIVO"
  );

  const fotos = dados ? getFotosPrestador(dados) : { perfil: "", servico: "" };
  const isPrimeiroPrestador = Number(dados?.prestadorId) === 1;
  const hasImagemPerfil = isPrimeiroPrestador || Boolean(dados?.imagemPerfil);
  const hasImagemServico = isPrimeiroPrestador || Boolean(dados?.imagemServico);
  const hasDescricaoLonga = (dados?.servicoDescricao || "").length > 90;

  const denunciaMotivos = [
    "Comentário ofensivo",
    "Informação enganosa",
    "Spam ou propaganda",
    "Conteúdo inapropriado",
    "Assédio ou ataque pessoal",
    "Outro motivo",
  ];

  const FeedbackDenunciaModal = ({ isOpen, onClose, tipo }) => {
    const isFeedback = tipo === "FEEDBACK";

    const [titulo, setTitulo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [nota, setNota] = useState(0);

    const resetForm = () => {
      setTitulo("");
      setMensagem("");
      setNota(0);
    };

    const fecharModal = () => {
      resetForm();
      onClose();
    };

    const enviar = async () => {
      const tituloTratado = titulo.trim();
      const mensagemTratada = mensagem.trim();

      if (!tituloTratado || !mensagemTratada || (isFeedback && !nota)) {
        alert("Preencha todos os campos obrigatórios!");
        return;
      }

      const payload = {
        titulo: tituloTratado,
        descricao: mensagemTratada,
        tipoFeedback: tipo,
        usuarioId: user?.id,
        nomeUsuario: user?.nome,
        prestadorId: dados.prestadorId,
        dataCadastro: new Date().toISOString(),
        statusFeedback: "ATIVO",
        ...(isFeedback ? { nota } : {}),
      };

      try {
        await axios.post("http://localhost:8080/api/v1/feedback", payload);

        if (isFeedback) {
          toast.success("Feedback enviado com sucesso!");
          setFeedbacks((prev) => [...prev, payload]);
        } else {
          toast.success("Denúncia enviada. Ela será revisada pelos administradores.");
        }

        resetForm();
        onClose();
      } catch (error) {
        console.error(error);
        alert("Erro ao enviar!");
      }
    };

    if (!isOpen) return null;

    return (
      <div
        className="profile-modal"
        onClick={(event) =>
          event.target.className === "profile-modal" && fecharModal()
        }
      >
        <div
          className={`profile-modal-wrapper ${
            isFeedback
              ? "profile-modal-wrapper--feedback"
              : "profile-modal-wrapper--denuncia"
          }`}
        >
          <button
            type="button"
            onClick={fecharModal}
            className="profile-modal-close"
            aria-label="Fechar modal"
          >
            ×
          </button>

          <div
            className={`profile-modal-content ${
              isFeedback ? "profile-modal-feedback" : "profile-modal-denuncia"
            }`}
          >
            <div className="profile-modal-icon-wrapper" aria-hidden="true">
              {isFeedback ? <FaRegCommentDots /> : <FaExclamationTriangle />}
            </div>

            <h1>{isFeedback ? "Registrar Feedback" : "Registrar denúncia"}</h1>

            <p className="profile-modal-subtitle">
              {isFeedback ? (
                <>
                  Sua opinião faz a diferença!
                  <br />
                  Compartilhe sua experiência e ajude outras pessoas a descobrirem
                  talentos da culinária.
                </>
              ) : (
                <>
                  Nos ajude a manter a plataforma segura e confiável.
                  <br />
                  Nos informe abaixo o que aconteceu.
                </>
              )}
            </p>

            {isFeedback ? (
              <>
                <div className="profile-rating-card">
                  <span className="profile-rating-title">
                    Como você avalia esse serviço?
                  </span>

                  <div
                    className="profile-rating-stars"
                    role="radiogroup"
                    aria-label="Nota do feedback"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="profile-rating-star"
                        onClick={() => setNota(star)}
                        aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                        aria-checked={nota === star}
                        role="radio"
                      >
                        {nota >= star ? <FaStar /> : <FaRegStar />}
                      </button>
                    ))}
                  </div>

                  <div className="profile-rating-labels">
                    <span>1 - Ruim</span>
                    <span>3 - Regular</span>
                    <span>5 - Excelente</span>
                  </div>

                  <small>Clique em uma estrela para avaliar</small>
                </div>

                <label className="profile-modal-field profile-modal-field--input">
                  <FaRegUser className="profile-modal-field-icon" />

                  <input
                    type="text"
                    placeholder="Título do feedback"
                    value={titulo}
                    onChange={(event) => setTitulo(event.target.value)}
                  />
                </label>
              </>
            ) : (
              <label className="profile-denuncia-select-label">
  <span className="profile-required-label">
    Motivo da denúncia <strong>*</strong>
  </span>

  <select
    className="profile-denuncia-select"
    value={titulo}
    onChange={(event) => setTitulo(event.target.value)}
  >
                  <option value="">Selecione um motivo</option>

                  {denunciaMotivos.map((motivo) => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label
              className={
                isFeedback
                  ? "profile-modal-field profile-modal-field--textarea"
                  : "profile-denuncia-textarea-label"
              }
            >
              {isFeedback ? (
                <FaPen className="profile-modal-field-icon profile-modal-field-icon--textarea" />
              ) : (
                <span className="profile-required-label">
  Descreva o ocorrido <strong>*</strong>
</span>
              )}

              <textarea
                placeholder={
                  isFeedback
                    ? "Conte-nos mais sobre sua experiência..."
                    : "Conte-nos com mais detalhes o que ocorreu..."
                }
                value={mensagem}
                onChange={(event) => setMensagem(event.target.value)}
              />
            </label>

            {!isFeedback && (
              <div className="profile-denuncia-confidential">
                <FaShieldAlt className="profile-denuncia-confidential-icon" />

                <div>
                  <strong>Sua denúncia é confidencial</strong>
                  <p>
                    Todas as informações serão analisadas com atenção e tratadas
                    com total sigilo.
                  </p>
                </div>
              </div>
            )}

            <button className="profile-modal-button" onClick={enviar}>
              ENVIAR
            </button>

            <p className="profile-modal-footer-note">
              <FaLock />

              {isFeedback
                ? "Seu feedback é importante e será tratado com respeito"
                : "Falsas denúncias podem ser tratadas com medidas administrativas"}
            </p>
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
              <div
                className={`profile-main ${
                  hasDescricaoLonga ? "profile-main-long-description" : ""
                }`}
              >
                <div className="profile-header-container">
                  <div className="profile-images">
                    {hasImagemPerfil ? (
                      <img
                        src={fotos.perfil}
                        alt="Imagem do prestador"
                        className="profile-image"
                      />
                    ) : (
                      <p>Imagem não encontrada</p>
                    )}
                  </div>

                  <h1 className="profile-h1">{dados.servicoNome}</h1>
                  <h3 className="profile-h3">{dados.servicoDescricao}</h3>
                </div>

                <div className="profile-main-container-footer">
                  <p className="profile-meiocontato">Meios de contato</p>
                </div>

                <div className="profile-main-container-footer-p2">
                  {contatos.length > 0 ? (
                    contatos.map((contato, index) => {
                      const { Icon, label, className } = getContatoInfo(contato);

                      return (
                        <a
                          key={`${label}-${index}`}
                          href={getContatoHref(contato)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`contact-link ${className}`}
                        >
                          <Icon className="contact-icon" />
                          {label}
                        </a>
                      );
                    })
                  ) : (
                    <span className="contact-text">
                      Nenhum meio de contato cadastrado.
                    </span>
                  )}
                </div>
              </div>

              <div className="profile-input-container">
                {hasImagemServico ? (
                  <img
                    src={fotos.servico}
                    alt="Imagem do serviço"
                    className="profile-image-2"
                  />
                ) : (
                  <p>Imagem não encontrada</p>
                )}
              </div>

              <div className="profile-buttons">
                <button
                  onClick={() => setOpenFeedback(true)}
                  className="profile-feedback"
                >
                  <FaPaperclip className="profile-feedback-icon" />
                  ENVIAR FEEDBACK
                </button>

                <button
                  onClick={() => setOpenDenuncia(true)}
                  className="profile-denuncia"
                >
                  <FaRegAngry className="profile-denuncia-icon" />
                  ENVIAR DENÚNCIA
                </button>
              </div>

              {feedbacksAtivos.length > 0 ? (
                <div className="profile-feedback-card">
                  {feedbacksAtivos.map((fb, index) => {
                    const nomeFeedback = getNomeFeedback(fb, nomesUsuarios);

                    return (
                      <article className="feedback-card-lenght" key={fb.id || index}>
                        <div className="feedback-card-header">
                          <div className="feedback-card-user">
                            <div className="feedback-avatar" aria-hidden="true">
                              {getInicialFeedback(nomeFeedback)}
                            </div>

                            <div className="feedback-user-info">
                              <h3 className="feedback-name">
                                {nomeFeedback}
                                <FaCheckCircle className="feedback-verified-icon" />
                              </h3>

                              <div className="feedback-meta">
                                <span className="profile-feedback-stars">{Array.from({ length: Math.min(5, Math.max(0, Math.round(Number(fb.nota) || 0))) }, (_, index) => (
                                  <MdStars key={index} className="profile-feedback-star-icon" />
                                ))}</span>
                                <span aria-hidden="true">•</span>
                                <span>{formatTempoFeedback(fb.dataCadastro)}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="feedback-report-button"
                            type="button"
                            aria-label="Denunciar feedback"
                          >
                            <FaRegFlag />
                          </button>
                        </div>

                        <h2>{fb.titulo}</h2>

                        <p>
                          {breakLineEveryNChars(fb.descricao, 110)}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p style={{ marginTop: "20px" }}>Sem feedbacks ativos.</p>
              )}

              <FeedbackDenunciaModal
                isOpen={openFeedback}
                onClose={() => setOpenFeedback(false)}
                tipo="FEEDBACK"
              />

              <FeedbackDenunciaModal
                isOpen={openDenuncia}
                onClose={() => setOpenDenuncia(false)}
                tipo="DENUNCIA"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
