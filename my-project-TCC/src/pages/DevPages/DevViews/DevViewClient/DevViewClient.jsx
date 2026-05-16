import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderSwitcher from "../../../../Components/HeaderSwitcher";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from "sonner";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../../../Components/Loading/Loading";
import { breakLineEveryNChars } from "../../../../utils/formatFeedbackText";
import "../DevViewPrestador/DevViewPrestador.css";
import "./DevViewClient.css";

const API_BASE_URL = "http://localhost:8080/api/v1";

const getPrestadorIdFromFeedback = (feedback = {}) =>
  Number(feedback.prestadorId ?? feedback.prestador_id ?? feedback.prestador?.id);

const getUsuarioIdFromFeedback = (feedback = {}) =>
  Number(feedback.usuarioId ?? feedback.usuario_id ?? feedback.usuario?.id);

const montarNomeUsuario = (usuario, fallback = "Usuário não encontrado") =>
  usuario?.nome || usuario?.name || fallback;

const montarNomePrestador = (prestador, fallback = "Prestador não encontrado") =>
  prestador?.nome || prestador?.usuario?.nome || fallback;

const DevViewClient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = location.state || {};

  const [nivel, setNivel] = useState(usuario?.nivelAcesso || "");
  const [usuarioStatus, setUsuarioStatus] = useState(usuario?.statusUsuario || false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [usuariosPorId, setUsuariosPorId] = useState({});
  const [prestadoresPorId, setPrestadoresPorId] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!usuario?.id) return;

    const fetchFeedbacks = async () => {
      try {
        const [feedbacksRes, usuariosRes, prestadoresRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/feedback`),
          axios.get(`${API_BASE_URL}/Usuario`),
          axios.get(`${API_BASE_URL}/prestador`),
        ]);

        const usuariosMap = Object.fromEntries(
          (usuariosRes.data || []).map((item) => [Number(item.id), item])
        );

        const prestadoresMap = Object.fromEntries(
          (prestadoresRes.data || []).map((item) => [Number(item.id), item])
        );

        const feedbacksUsuario = (feedbacksRes.data || []).filter(
          (f) => getUsuarioIdFromFeedback(f) === Number(usuario.id)
        );

        setUsuariosPorId(usuariosMap);
        setPrestadoresPorId(prestadoresMap);
        setFeedbacks(feedbacksUsuario);
      } catch (error) {
        console.error("[DevViewClient] Erro ao buscar feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [usuario]);

  const editarNivel = async (id, novoNivel) => {
    const toastId = toast.loading("Atualizando nível de acesso...");
    try {
      await axios.put(`${API_BASE_URL}/Usuario/${id}`, {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        nivelAcesso: novoNivel,
        statusUsuario: usuarioStatus,
      });

      setNivel(novoNivel);
      toast.success("Nível de acesso atualizado!", { id: toastId });
    } catch (error) {
      toast.warning("Erro ao atualizar nível.", { id: toastId });
      console.error("[DevViewClient] Erro ao atualizar nível:", error);
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
      console.error("[DevViewClient] Erro ao atualizar status do feedback:", error);
      toast.error("Erro ao atualizar status do feedback!", { id: toastId });
    }
  };

  const editarStatus = async (id, novoStatus) => {
    const toastId = toast.loading("Atualizando status do usuário...");
    try {
      await axios.put(`${API_BASE_URL}/Usuario/${id}`, {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        nivelAcesso: nivel,
        statusUsuario: novoStatus,
      });

      setUsuarioStatus(novoStatus);
      toast.success("Status atualizado com sucesso!", { id: toastId });
    } catch (error) {
      toast.warning("Erro ao atualizar status.", { id: toastId });
      console.error("[DevViewClient] Erro ao atualizar status:", error);
    }
  };

  const abrirPrestadorAvaliado = (prestadorId) => {
    if (!prestadorId) {
      toast.warning("Prestador avaliado não encontrado.");
      return;
    }

    navigate(`/dev-view-prestador/${prestadorId}`);
  };

  if (!usuario) return <div>Nenhum usuário encontrado.</div>;
  if (loading) return <Loading />;

  return (
    <div className="devclient-page">
      <HeaderSwitcher />

      <div className="devclient-container">
        <h1 className="devclient-h1">INFORMAÇÕES DO CLIENTE</h1>
        <h3>Apenas administradores podem visualizar estas informações.</h3>

        <p className="devclient-label">NOME</p>
        <input className="devclient-input" type="text" value={usuario.nome} disabled />

        <p className="devclient-label">EMAIL</p>
        <input className="devclient-input" type="email" value={usuario.email} disabled />

        <p className="devclient-label">Nível de acesso</p>
        <div className="devclient-dropdown">
          <button className="btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {nivel} <MdOutlineKeyboardArrowDown className="devclient-icon" />
          </button>

          {dropdownOpen && (
            <div className="devclient-dropdown-menu">
              {["ADMIN", "CLIENTE"].map((option) => (
                <div
                  key={option}
                  className="devclient-dropdown-item"
                  onClick={() => {
                    editarNivel(usuario.id, option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
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
              const prestadorId = getPrestadorIdFromFeedback(fb);
              const remetente = usuariosPorId[usuarioId] || usuario;
              const avaliado = prestadoresPorId[prestadorId] || fb.prestador;

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
                        onClick={() => abrirPrestadorAvaliado(prestadorId)}
                      >
                        {montarNomePrestador(avaliado, `Prestador #${prestadorId}`)}
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

        <button
          className={`devclient-status-btn ${usuarioStatus ? "ativo" : "inativo"}`}
          onClick={() => editarStatus(usuario.id, !usuarioStatus)}
        >
          {usuarioStatus ? "Conta Ativa" : "Conta Inativa"}
        </button>
      </div>
    </div>
  );
};

export default DevViewClient;
