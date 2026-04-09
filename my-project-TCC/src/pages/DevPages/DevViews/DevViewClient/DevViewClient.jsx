import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderSwitcher from '../../../../Components/HeaderSwitcher';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from 'sonner';
import axios from 'axios';
import Swal from "sweetalert2";
import Loading from '../../../../Components/Loading/Loading';

import "../DevViewPrestador/DevViewPrestador.css";
import './DevViewClient.css';

const DevViewClient = () => {
  const location = useLocation();
  const { usuario } = location.state || {};

  const [nivel, setNivel] = useState(usuario?.nivelAcesso || '');
  const [usuarioStatus, setUsuarioStatus] = useState(usuario?.statusUsuario || false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [nomesPrestadores, setNomesPrestadores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const buscarNomePrestadorPorId = async (prestadorId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/prestador/${prestadorId}`);
      return res.data?.nome || `Prestador #${prestadorId}`;
    } catch (error) {
      console.error(`Erro ao buscar prestador ${prestadorId}:`, error);
      return `Prestador #${prestadorId}`;
    }
  };

  useEffect(() => {
    if (!usuario?.id) return;

    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/feedback");

        const feedbacksUsuario = res.data.filter(
          (f) => f.usuarioId === usuario.id
        );

        const idsPrestadores = [
          ...new Set(feedbacksUsuario.map((f) => f.prestadorId).filter(Boolean))
        ];

        const nomesArray = await Promise.all(
          idsPrestadores.map(async (id) => [
            Number(id),
            await buscarNomePrestadorPorId(id)
          ])
        );

        setNomesPrestadores(Object.fromEntries(nomesArray));
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
<div className="devclient-feedbacks">
  {feedbacks.length === 0 ? (
    <p>Nenhum feedback carregado.</p>
  ) : (
    feedbacks.map((fb) => (
      <div
  key={fb.id}
  className={`devclient-feedback-card ${
    fb.tipoFeedback === "FEEDBACK" ? "feedback" : "denuncia"
  } ${fb.statusFeedback === "INATIVO" ? "inactive" : ""}`}
>
  {/* HEADER */}
  <div className="devclient-feedback-header">
    <div>
      <h3 className="devclient-feedback-name">
        Usuário: {usuario.nome}
      </h3>

      <p className="devclient-feedback-prestador">
        Prestador: {nomesPrestadores[Number(fb.prestadorId)] || `#${fb.prestadorId}`}
      </p>
    </div>

    <div className="devclient-feedback-status-row">
      <label className="devclient-feedback-switch">
        <input
          type="checkbox"
          checked={fb.statusFeedback === "ATIVO"}
          onChange={() => editarStatusFeedback(fb)}
        />
        <span className="devclient-feedback-slider"></span>
      </label>
    </div>
  </div>

  {/* CONTEÚDO */}
  <h4 className="devclient-feedback-title">{fb.titulo}</h4>

  <p className="devclient-feedback-desc">{fb.descricao}</p>

  {fb.nota !== undefined && (
    <p><strong>Nota:</strong> {fb.nota}⭐</p>
  )}
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