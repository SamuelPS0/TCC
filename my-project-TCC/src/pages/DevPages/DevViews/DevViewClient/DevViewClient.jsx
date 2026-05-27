import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HeaderSwitcher from '../../../../Components/HeaderSwitcher';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from 'sonner';
import axios from 'axios';
import Swal from "sweetalert2";
import { MdStars } from "react-icons/md";
import Loading from '../../../../Components/Loading/Loading';
import { breakLineEveryNChars } from '../../../../utils/formatFeedbackText';
import { getNomeFeedback, getInicialFeedback, formatNotaFeedback, formatTempoFeedback, getNotaInteira } from '../../../../utils/devviewFeedback';
import '../feedbackShared.css';
import "../DevViewPrestador/DevViewPrestador.css";
import './DevViewClient.css';

const DevViewClient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = location.state || {};

  const [nivel, setNivel] = useState(usuario?.nivelAcesso || '');
  const [usuarioStatus, setUsuarioStatus] = useState(usuario?.statusUsuario || false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prestadoresInfo, setPrestadoresInfo] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!usuario?.id) return;

    const fetchFeedbacks = async () => {
      const prestadoresRes = await axios.get("http://localhost:8080/api/v1/prestador");
      const prestadoresMap = Object.fromEntries((prestadoresRes.data || []).map((p) => [Number(p.id), p]));
      setPrestadoresInfo(prestadoresMap);
      try {
        const res = await axios.get("http://localhost:8080/api/v1/feedback");

        const feedbacksUsuario = res.data.filter(
          (f) => f.usuarioId === usuario.id
        );

        setFeedbacks(feedbacksUsuario);

      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [usuario]);

  const editarNivel = async (id, novoNivel) => {
    const toastId = toast.loading('Atualizando nível de acesso...');
    try {
      await axios.put(`http://localhost:8080/api/v1/Usuario/${id}`, {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        nivelAcesso: novoNivel,
        statusUsuario: usuarioStatus
      });

      setNivel(novoNivel);
      toast.success('Nível de acesso atualizado!', { id: toastId });

    } catch (error) {
      toast.warning('Erro ao atualizar nível.', { id: toastId });
      console.error(error);
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
    customClass: {
      popup: "swal-poppins-popup",
      title: "swal-poppins-title",
      htmlContainer: "swal-poppins-text",
      confirmButton: "swal-poppins-confirm",
      cancelButton: "swal-poppins-cancel",
    },
  });

  if (!result.isConfirmed) return;

  const toastId = toast.loading("Atualizando status do feedback...");

  try {
    await axios.put(`http://localhost:8080/api/v1/feedback/${feedback.id}`, {
      statusFeedback: novoStatus,
    });

    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === feedback.id ? { ...fb, statusFeedback: novoStatus } : fb
      )
    );

    toast.success(`Feedback ${novoStatus.toLowerCase()} com sucesso!`, { id: toastId });

  } catch (error) {
    console.error("Erro ao atualizar status do feedback:", error);
    toast.error("Erro ao atualizar status do feedback!", { id: toastId });
  }
};

  const abrirDevViewUsuario = async (usuarioId) => {
    if (!usuarioId) return;

    try {
      const { data } = await axios.get(`http://localhost:8080/api/v1/Usuario/${usuarioId}`);
      navigate('/dev-view-client', { state: { usuario: data } });
    } catch (error) {
      console.error("Erro ao abrir DevView do usuário:", error);
      toast.error("Não foi possível abrir o DevView do usuário.");
    }
  };

  const editarStatus = async (id, novoStatus) => {
    const toastId = toast.loading('Atualizando status do usuário...');
    try {
      await axios.put(`http://localhost:8080/api/v1/Usuario/${id}`, {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        nivelAcesso: nivel,
        statusUsuario: novoStatus
      });

      setUsuarioStatus(novoStatus);
      toast.success('Status atualizado com sucesso!', { id: toastId });

    } catch (error) {
      toast.warning('Erro ao atualizar status.', { id: toastId });
      console.error(error);
    }
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
              {['ADMIN', 'CLIENTE'].map((option) => (
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

        {/* FEEDBACKS */}
        <h2 className="feedback-title">Feedbacks & Ocorrências</h2>
        <div className="prestview-feedbacks">
          {feedbacks.length === 0 ? (
            <p>Nenhum feedback carregado.</p>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb.id}
                className={`prestview-feedback-card devview-feedback-card ${fb.tipoFeedback === "FEEDBACK" ? "feedback" : "denuncia"} ${fb.statusFeedback === "INATIVO" ? "inactive" : ""}`}
              >
                <div className="devview-feedback-header">
                  <div className="devview-feedback-user">
                  <span className="devview-feedback-avatar">{getInicialFeedback(getNomeFeedback(fb, { [Number(usuario.id)]: usuario.nome }))}</span>
                  <div>
                    <h3 className="devview-feedback-name">
                      <button
                        type="button"
                        className="devview-feedback-name-link"
                        onClick={() => abrirDevViewUsuario(fb.usuarioId)}
                      >
                        {getNomeFeedback(fb, { [Number(usuario.id)]: usuario.nome })}
                      </button>
                    </h3>
                    <p className="devview-feedback-time">{formatTempoFeedback(fb.dataCadastro)}</p>
                  </div>
                </div>
                  <div className="feedback-status-row">
                    <label className="feedback-switch" title={fb.statusFeedback === "ATIVO" ? "Desativar feedback" : "Ativar feedback"}>
                      <input
                        type="checkbox"
                        checked={fb.statusFeedback === "ATIVO"}
                        onChange={() => editarStatusFeedback(fb)}
                      />
                      <span className="feedback-slider"></span>
                    </label>
                  </div>
                </div>
                <h4>{fb.titulo}</h4>
                <p className="devview-feedback-target">Para: <Link to={`/dev-view-prestador/${Number(fb.prestadorId)}`}>{prestadoresInfo[Number(fb.prestadorId)]?.nome || `Prestador #${fb.prestadorId || ""}`}</Link></p>
                <p style={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                  {breakLineEveryNChars(fb.descricao, 70)}
                </p>
                <p className="devview-feedback-note"><strong>Nota:</strong> {getNotaInteira(fb.nota) > 0 ? Array.from({ length: getNotaInteira(fb.nota) }, (_, index) => <MdStars key={index} className="devview-feedback-star" />) : formatNotaFeedback(fb.nota)}</p>
              </div>
            ))
          )}
        </div>

        <button
          className={`devclient-status-btn ${usuarioStatus ? 'ativo' : 'inativo'}`}
          onClick={() => editarStatus(usuario.id, !usuarioStatus)}
        >
          {usuarioStatus ? 'Conta Ativa' : 'Conta Inativa'}
        </button>

      </div>
    </div>
  );
};

export default DevViewClient;
