import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import HeaderSwitcher from "../../../../Components/HeaderSwitcher";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdImage, IoIosCall } from "react-icons/io";
import { FaMapMarkerAlt, FaList } from "react-icons/fa";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Loading from "../../../../Components/Loading/Loading";
import "./DevViewPrestador.css";
import { breakLineEveryNChars } from "../../../../utils/formatFeedbackText";

const API_BASE_URL = "http://localhost:8080/api/v1";

const normalizeImageSrc = (value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed || trimmed.includes("System.Byte[")) {
    return null;
  }

  const looksLikeBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(trimmed);
  const isDirectUrl =
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image") ||
    trimmed.startsWith("blob:") ||
    (trimmed.startsWith("/") && !looksLikeBase64);

  if (isDirectUrl) return trimmed;

  return `data:image/jpeg;base64,${trimmed}`;
};

const getImageField = (obj = {}, possibleKeys = []) => {
  for (const key of possibleKeys) {
    const parsed = normalizeImageSrc(obj?.[key]);
    if (parsed) return parsed;
  }

  return null;
};

const getPrestadorId = (item = {}) =>
  Number(item.prestadorId ?? item.prestador_id ?? item.prestador?.id);

const getPrestadorIdFromFeedback = (feedback = {}) =>
  Number(feedback.prestadorId ?? feedback.prestador_id ?? feedback.prestador?.id);

const getUsuarioIdFromFeedback = (feedback = {}) =>
  Number(feedback.usuarioId ?? feedback.usuario_id ?? feedback.usuario?.id);

const normalizeStatus = (status, fallback = "") =>
  String(status ?? fallback).trim().toUpperCase();

const isAtivo = (status) => normalizeStatus(status, "INATIVO") === "ATIVO";

const getContatoLabel = (contato = {}) =>
  contato.tipoContato ?? contato.tipo_contato ?? contato.tipo ?? contato.label ?? "Contato";

const montarNomeUsuario = (usuario, fallback = "Usuário não encontrado") =>
  usuario?.nome || usuario?.name || fallback;

const montarNomePrestador = (prestador, fallback = "Prestador não encontrado") =>
  prestador?.nome || prestador?.usuario?.nome || fallback;

const DevViewPrestador = () => {
  const { prestadorId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [usuariosPorId, setUsuariosPorId] = useState({});
  const [prestadoresPorId, setPrestadoresPorId] = useState({});
  const [prestador, setPrestador] = useState(null);
  const [statusPrestador, setStatusPrestador] = useState("EM_ANALISE");

  useEffect(() => {
    const fetchPrestador = async () => {
      try {
        const prestadorRes = await axios.get(`${API_BASE_URL}/prestador/${prestadorId}`);
        const prestadorData = prestadorRes.data;

        if (!prestadorData) {
          toast.error("Prestador não encontrado!");
          setLoading(false);
          return;
        }

        const [servicosRes, contatosRes, feedbacksRes, usuariosRes, prestadoresRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/servico`),
            axios.get(`${API_BASE_URL}/contato`),
            axios.get(`${API_BASE_URL}/feedback`),
            axios.get(`${API_BASE_URL}/Usuario`),
            axios.get(`${API_BASE_URL}/prestador`),
          ]);

        const servico = (servicosRes.data || []).find(
          (s) => getPrestadorId(s) === Number(prestadorData.id)
        );
        const usuarioPrestador =
          prestadorData.usuario || servico?.prestador?.usuario || {};

        const contatosAtivos = (contatosRes.data || []).filter(
          (c) => getPrestadorId(c) === Number(prestadorData.id) && isAtivo(c.statusContato)
        );

        const feedbacksPrestador = (feedbacksRes.data || []).filter(
          (f) => getPrestadorIdFromFeedback(f) === Number(prestadorData.id) && f.statusFeedback
        );

        setUsuariosPorId(
          Object.fromEntries((usuariosRes.data || []).map((item) => [Number(item.id), item]))
        );
        setPrestadoresPorId(
          Object.fromEntries((prestadoresRes.data || []).map((item) => [Number(item.id), item]))
        );

        const fotoPerfil =
          getImageField(prestadorData, ["foto", "fotoPerfil", "imagemPerfil", "imagem"]) ||
          getImageField(usuarioPrestador, ["foto", "fotoPerfil", "imagemPerfil", "imagem"]);
        const fotoServico = getImageField(servico, [
          "fotoServico",
          "imagemServico",
          "foto",
          "imagem",
        ]);

        const cardData = {
          prestadorNome: prestadorData.nome || usuarioPrestador.nome || "Nome não cadastrado",
          servicoNome: servico?.nome || "Serviço não cadastrado",
          servicoDescricao: servico?.descricao || "Descrição não cadastrada",
          categoria: servico?.categoria?.nome || "Categoria não cadastrada",
          cidade: prestadorData.cidade || "Cidade não cadastrada",
          uf: prestadorData.uf || "UF não cadastrada",
          contatos: contatosAtivos.map((contato) => ({
            id: contato.id ?? `${getContatoLabel(contato)}-${contato.link}`,
            tipo: getContatoLabel(contato),
            link: contato.link ?? contato.value ?? contato.url ?? "Contato sem link cadastrado",
          })),
          foto: fotoPerfil,
          fotoServico,
        };

        setPrestador(prestadorData);
        setStatusPrestador(
          normalizeStatus(
            prestadorData.statusPrestador ??
              prestadorData.status_prestador ??
              prestadorData.status,
            "EM_ANALISE"
          )
        );
        setCard(cardData);
        setFeedbacks(feedbacksPrestador);
      } catch (error) {
        console.error("[DevViewPrestador] Erro ao carregar prestador:", error);
        toast.error("Erro ao carregar prestador!");
      } finally {
        setLoading(false);
      }
    };

    fetchPrestador();
  }, [prestadorId]);

  const editarStatusPrestador = async (id, novoStatus) => {
    const statusString = normalizeStatus(novoStatus, "INATIVO");
    const toastId = toast.loading("Atualizando status...");

    try {
      const prestadorRes = await axios.get(`${API_BASE_URL}/prestador/${id}`);
      const prestadorData = prestadorRes.data;

      const usuariosRes = await axios.get(`${API_BASE_URL}/Usuario`);
      const usuarioVinculado = usuariosRes.data.find(
        (u) => Number(u.id) === Number(prestadorData.usuario_id)
      );

      await axios.put(`${API_BASE_URL}/prestador/${id}`, {
        ...prestadorData,
        statusPrestador: statusString,
      });

      if (usuarioVinculado) {
        await axios.put(`${API_BASE_URL}/Usuario/${usuarioVinculado.id}`, {
          ...usuarioVinculado,
          statusUsuario: statusString === "ATIVO",
        });
      }

      setStatusPrestador(statusString);
      toast.success(`Prestador ${statusString.toLowerCase()} com sucesso!`, {
        id: toastId,
      });
    } catch (error) {
      console.error("[DevViewPrestador] Erro ao atualizar prestador/usuário:", error);
      toast.error("Erro ao atualizar prestador e/ou usuário!", { id: toastId });
    }
  };

  const editarStatusFeedback = async (feedback) => {
    const ativando = feedback.statusFeedback !== "ATIVO";
    const novoStatus = ativando ? "ATIVO" : "INATIVO";

    const result = await Swal.fire({
      title: ativando ? "Ativar feedback?" : "Desativar feedback?",
      text: ativando
        ? "O feedback ficará visível novamente."
        : "O feedback deixará de aparecer para os usuários.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26c26a",
      cancelButtonColor: "#e74c3c",
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const toastId = toast.loading("Atualizando status do feedback...");

    try {
      await axios.put(`${API_BASE_URL}/feedback/${feedback.id}`, {
        statusFeedback: novoStatus,
      });

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === feedback.id ? { ...fb, statusFeedback: novoStatus } : fb
        )
      );

      toast.success(`Feedback ${novoStatus.toLowerCase()} com sucesso!`, {
        id: toastId,
      });
    } catch (error) {
      console.error("[DevViewPrestador] Erro ao atualizar status do feedback:", error);
      toast.error("Erro ao atualizar status do feedback!", { id: toastId });
    }
  };

  const abrirPrestadorAvaliado = (id) => {
    if (!id) {
      toast.warning("Prestador avaliado não encontrado.");
      return;
    }

    navigate(`/dev-view-prestador/${id}`);
  };

  if (loading) return <Loading />;
  if (!card) return <p>Prestador não encontrado.</p>;

  return (
    <div className="prestview-page">
      <HeaderSwitcher />
      <div className="prestview-container">
        {card.foto ? (
          <img src={card.foto} alt="Prestador" className="prestview-photo" />
        ) : (
          <div className="prestview-photo-placeholder">Foto do prestador não cadastrada</div>
        )}

        <div className="prestview-field">
          <label className="prestview-label">
            <IoPersonCircleOutline className="icon" /> Nome
          </label>
          <input type="text" className="prestview-input" value={card.prestadorNome} readOnly />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <FaList className="icon" /> Serviço
          </label>
          <input type="text" className="prestview-input" value={card.servicoNome} readOnly />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <FaList className="icon" /> Descrição
          </label>
          <textarea className="prestview-input" value={card.servicoDescricao} readOnly />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <IoIosCall className="icon" /> Contatos
          </label>
          <div className="prestview-contacts">
            {card.contatos.length === 0 ? (
              <input
                type="text"
                value="Nenhum contato ativo cadastrado"
                readOnly
                className="prestview-input"
              />
            ) : (
              card.contatos.map((contato) => (
                <div className="prestview-contact-row" key={contato.id}>
                  <span className="prestview-contact-type">{contato.tipo}</span>
                  <input type="text" value={contato.link} readOnly className="prestview-input" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <FaMapMarkerAlt className="icon" /> Região
          </label>
          <input
            type="text"
            value={`${card.cidade} - ${card.uf}`}
            readOnly
            className="prestview-input"
          />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <FaList className="icon" /> Categoria
          </label>
          <input type="text" value={card.categoria} readOnly className="prestview-input" />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <IoMdImage className="icon" /> Foto serviço
          </label>
          {card.fotoServico ? (
            <img src={card.fotoServico} alt="Imagem do serviço" className="prestview-image-2" />
          ) : (
            <div className="prestview-service-image-placeholder">
              Foto do serviço não cadastrada
            </div>
          )}
        </div>

        <h2 className="feedback-title">Feedbacks & Ocorrências</h2>
        <div className="prestview-feedbacks">
          {feedbacks.length === 0 ? (
            <p>Nenhum feedback carregado.</p>
          ) : (
            feedbacks.map((fb) => {
              const usuarioId = getUsuarioIdFromFeedback(fb);
              const feedbackPrestadorId = getPrestadorIdFromFeedback(fb);
              const remetente = usuariosPorId[usuarioId] || fb.usuario;
              const avaliado =
                prestadoresPorId[feedbackPrestadorId] || prestador || fb.prestador;

              return (
                <div
                  key={fb.id}
                  className={`prestview-feedback-card ${
                    fb.tipoFeedback === "FEEDBACK" ? "feedback" : "denuncia"
                  } ${fb.statusFeedback === "INATIVO" ? "inactive" : ""}`}
                >
                  <div className="feedback-status-row">
                    <label
                      className="feedback-switch"
                      title={
                        fb.statusFeedback === "ATIVO"
                          ? "Desativar feedback"
                          : "Ativar feedback"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={fb.statusFeedback === "ATIVO"}
                        onChange={() => editarStatusFeedback(fb)}
                      />
                      <span className="feedback-slider"></span>
                    </label>
                  </div>

                  <div className="feedback-participants">
                    <span>
                      <strong>Enviado por:</strong>{" "}
                      {montarNomeUsuario(remetente, `Usuário #${usuarioId}`)}
                    </span>
                    <span>
                      <strong>Enviado para:</strong>{" "}
                      <button
                        type="button"
                        className="feedback-profile-link"
                        onClick={() => abrirPrestadorAvaliado(feedbackPrestadorId)}
                      >
                        {montarNomePrestador(avaliado, `Prestador #${feedbackPrestadorId}`)}
                      </button>
                    </span>
                  </div>

                  <h4>{fb.titulo}</h4>
                  <p style={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                    {breakLineEveryNChars(fb.descricao, 70)}
                  </p>

                  <div className="feedback-card-footer">
                    <span className="feedback-type-badge">
                      {fb.tipoFeedback === "FEEDBACK" ? "Feedback" : "Denúncia"}
                    </span>
                    {fb.nota !== undefined && fb.tipoFeedback === "FEEDBACK" && (
                      <span>
                        <strong>Nota:</strong> {fb.nota} estrela(s)
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {prestador && (
          <div className="prestview-buttons">
            {statusPrestador === "EM_ANALISE" ? (
              <>
                <button
                  className="btn-delete"
                  onClick={() => editarStatusPrestador(prestador.id, "INATIVO")}
                >
                  Recusar conta
                </button>
                <button
                  className="btn-edit"
                  onClick={() => editarStatusPrestador(prestador.id, "ATIVO")}
                >
                  Aprovar conta
                </button>
              </>
            ) : (
              <button
                className={statusPrestador === "ATIVO" ? "btn-edit" : "btn-delete"}
                onClick={() =>
                  editarStatusPrestador(
                    prestador.id,
                    statusPrestador === "ATIVO" ? "INATIVO" : "ATIVO"
                  )
                }
              >
                {statusPrestador === "ATIVO" ? "Inativar conta" : "Ativar conta"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevViewPrestador;
