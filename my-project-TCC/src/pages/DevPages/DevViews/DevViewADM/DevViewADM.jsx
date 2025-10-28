import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderSwitcher from '../../../../Components/HeaderSwitcher';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from 'sonner';
import axios from 'axios';
import Loading from '../../../../Components/Loading/Loading';
import './DevViewADM.css';

const DevViewADM = () => {
  const location = useLocation();
  const { usuario } = location.state || {};

  const [nivel, setNivel] = useState(usuario?.nivelAcesso || '');
  const [usuarioStatus, setUsuarioStatus] = useState(usuario?.statusUsuario || false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregamento inicial de 2 segundos (mesmo padrão do DevViewClient)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Atualiza informações do usuário ao carregar
  useEffect(() => {
    if (usuario) {
      setNivel(usuario.nivelAcesso);
      setUsuarioStatus(usuario.statusUsuario);
      console.log('Informações recebidas: ', usuario);
    }
  }, [usuario]);

  // Busca feedbacks e denúncias do usuário
  useEffect(() => {
    const buscarFeedbacks = async () => {
      if (!usuario?.id) return;

      console.log('🔹 Buscando feedbacks e denúncias do usuário:', usuario.id);
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/feedback`);
        const feedbacksUsuario = response.data.filter((fb) => fb.usuarioId === usuario.id);
        console.log('🔹 Feedbacks filtrados:', feedbacksUsuario);
        setFeedbacks(feedbacksUsuario);
      } catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
      }
    };

    buscarFeedbacks();
  }, [usuario]);

  // Função para editar nível de acesso
  const editarNivel = async (id, novoNivel) => {
    const toastId = toast.loading('Atualizando nível de acesso...');
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/Usuario/${id}`, {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        nivelAcesso: novoNivel,
        statusUsuario: usuarioStatus,
      });
      setNivel(novoNivel);
      toast.success('Nível de acesso atualizado com sucesso!', { id: toastId });
      console.log('Nível de acesso atualizado com sucesso!', response.data);
    } catch (error) {
      toast.warning('Ocorreu um erro... Cheque o console');
      console.error('Erro ao editar nível:', error);
    }
  };

  // Função para editar status do usuário
  const editarStatus = async (id, novoStatus) => {
    const toastId = toast.loading('Atualizando status do usuário...');
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/Usuario/${id}`, {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        nivelAcesso: nivel,
        statusUsuario: novoStatus,
      });
      setUsuarioStatus(response.data.statusUsuario);
      toast.success('Status atualizado com sucesso!', { id: toastId });
      console.log('Status atualizado com sucesso!', response.data.statusUsuario);
    } catch (error) {
      console.error('Erro ao editar status:', error);
    }
  };

  if (!usuario) return <div>Nenhum usuário encontrado.</div>;
  if (loading) return <Loading />; // mesmo comportamento do DevViewClient

  return (
    <div className="devadm-page">
      <HeaderSwitcher />

      <div className="devadm-container">
        <h1 className="devadm-h1">INFORMAÇÕES DO USUÁRIO</h1>
        <h3>Apenas administradores podem visualizar estas informações.</h3>

        <p className="devadm-label">NOME</p>
        <input className="devadm-input" type="text" value={usuario.nome} disabled />

        <p className="devadm-label">EMAIL</p>
        <input className="devadm-input" type="email" value={usuario.email} disabled />

        <p className="devadm-label">Nível de acesso</p>
        <div className="devadm-dropdown">
          <button className="btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {nivel} <MdOutlineKeyboardArrowDown className="devadm-icon" />
          </button>

          {dropdownOpen && (
            <div className="devadm-dropdown-menu">
              {['ADMIN', 'CLIENTE'].map((option) => (
                <div
                  key={option}
                  className="devadm-dropdown-item"
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

        {/* ====== Feedbacks e Denúncias ====== */}
        <div className="devadm-feedbacks">
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
            <p className="devadm-sem-feedbacks">Nenhum feedback encontrado.</p>
          )}
        </div>

        <button
          className={`devadm-status-btn ${usuarioStatus ? 'ativo' : 'inativo'}`}
          onClick={() => {
            const novoStatus = !usuarioStatus;
            setUsuarioStatus(novoStatus);
            editarStatus(usuario.id, novoStatus);
          }}
        >
          {usuarioStatus ? 'Conta Ativa' : 'Conta Inativa'}
        </button>
      </div>
    </div>
  );
};

export default DevViewADM;
