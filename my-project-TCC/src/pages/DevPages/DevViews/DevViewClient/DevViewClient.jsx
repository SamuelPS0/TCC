import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderSwitcher from '../../../../Components/HeaderSwitcher';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { toast } from 'sonner';
import axios from 'axios';
import Loading from '../../../../Components/Loading/Loading'; // 👈 Import do loader
import './DevViewClient.css';

const DevViewClient = () => {
  const location = useLocation();
  const { usuario } = location.state || {};

  const [nivel, setNivel] = useState(usuario?.nivelAcesso || '');
  const [usuarioStatus, setUsuarioStatus] = useState(usuario?.statusUsuario || false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Estado do loader

  // Simula carregamento (2s com animação constante)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Busca feedbacks
  useEffect(() => {
    if (!usuario?.id) return;

    console.log("🔹 Buscando feedbacks e denúncias do usuário:", usuario.id);

    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/feedback");
        const feedbacksUsuario = res.data.filter((f) => f.usuarioId === usuario.id);
        console.log("🔹 Feedbacks filtrados para este usuário:", feedbacksUsuario);
        setFeedbacks(feedbacksUsuario);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [usuario]);

  // Edição de nível
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

  // Edição de status
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

  // Exibição do loader
  if (!usuario) return <div>Nenhum usuário encontrado.</div>;
  if (loading) return <Loading />; // 👈 Mostra o componente Loading até carregar

  // Exibição principal
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

        {/* ====== Feedbacks ====== */}
        <div className="devclient-feedbacks">
          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <div
                key={fb.id}
                className={`feedback-card ${
                  fb.tipoFeedback === 'FEEDBACK' ? 'feedback' : 'denuncia'
                }`}
              >
                <h2>{fb.titulo}</h2>
                <p>{fb.descricao}</p>
              </div>
            ))
          ) : (
            <p className="devclient-sem-feedbacks">Nenhum feedback encontrado.</p>
          )}
        </div>

        {/* ====== Botão de status ====== */}
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
