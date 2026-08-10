import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderSwitcher from '../../../../Components/HeaderSwitcher';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from 'sonner';
import axios from 'axios';
import {
  getUsuarioEmail,
  normalizeStatusUsuario,
  usuarioService
} from '../../../../services/usuarioService';
import Swal from "sweetalert2";
import { MdStars } from "react-icons/md";
import Loading from '../../../../Components/Loading/Loading';
import './DevViewADM.css';
import { breakLineEveryNChars } from '../../../../utils/formatFeedbackText';
import {
  getNomeFeedback,
  getInicialFeedback,
  formatNotaFeedback,
  formatTempoFeedback,
  getNotaInteira
} from '../../../../utils/devviewFeedback';
import '../feedbackShared.css';

const DevViewADM = () => {
  const location = useLocation();
  const { usuario } = location.state || {};

  const [nivel, setNivel] = useState(usuario?.nivelAcesso || '');
  const [usuarioStatus, setUsuarioStatus] = useState(
    normalizeStatusUsuario(usuario?.statusUsuario)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prestadoresInfo, setPrestadoresInfo] = useState({});

  // Carregamento inicial de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Atualiza informações do usuário ao carregar
  useEffect(() => {
    if (usuario) {
      setNivel(usuario.nivelAcesso || '');
      setUsuarioStatus(
        normalizeStatusUsuario(usuario.statusUsuario)
      );

      console.log('Informações recebidas:', usuario);
      console.log('ID do usuário:', usuario.id);
      console.log('Nome do usuário:', usuario.nome);
      console.log('Email do usuário:', getUsuarioEmail(usuario));
      console.log('Nível de acesso:', usuario.nivelAcesso);
      console.log('Status do usuário:', usuario.statusUsuario);
    }
  }, [usuario]);

  // Busca feedbacks e denúncias do usuário
  useEffect(() => {
    const buscarFeedbacks = async () => {
      try {
        console.log('Buscando prestadores...');

        const prestadoresRes = await axios.get(
          'http://localhost:8080/api/v1/prestador'
        );

        console.log(
          'Prestadores recebidos:',
          prestadoresRes.data
        );

        const prestadoresMap = Object.fromEntries(
          (prestadoresRes.data || []).map((p) => [
            Number(p.id),
            {
              ...p,
              nome:
                p.nome ||
                p.usuario?.nome ||
                p.usuario_nome ||
                "Prestador sem nome"
            }
          ])
        );

        setPrestadoresInfo(prestadoresMap);

        if (!usuario?.id) {
          console.log(
            'Nenhum ID de usuário encontrado. Busca de feedbacks cancelada.'
          );
          return;
        }

        console.log(
          'Buscando feedbacks e denúncias do usuário:',
          usuario.id
        );

        const response = await axios.get(
          'http://localhost:8080/api/v1/feedback'
        );

        console.log(
          'Todos os feedbacks recebidos:',
          response.data
        );

        const feedbacksUsuario = response.data.filter(
          (fb) => Number(fb.usuarioId) === Number(usuario.id)
        );

        console.log(
          'Feedbacks filtrados do usuário:',
          feedbacksUsuario
        );

        setFeedbacks(feedbacksUsuario);
      } catch (error) {
        console.error(
          'Erro ao buscar feedbacks/prestadores:',
          error
        );
      }
    };

    buscarFeedbacks();
  }, [usuario]);

  // Função para editar nível de acesso
  const editarNivel = async (id, novoNivel) => {
    const toastId = toast.loading(
      'Atualizando nível de acesso...'
    );

    console.log('Iniciando alteração de nível...');
    console.log('ID:', id);
    console.log('Novo nível:', novoNivel);

    try {
      const response = await usuarioService.editar(id, {
        nome: usuario.nome,
        username: getUsuarioEmail(usuario),
        nivelAcesso: novoNivel
      });

      console.log(
        'Resposta da alteração de nível:',
        response.data
      );

      setNivel(novoNivel);

      toast.success(
        'Nível de acesso atualizado com sucesso!',
        {
          id: toastId
        }
      );
    } catch (error) {
      console.error(
        'Erro ao editar nível:',
        error
      );

      console.error(
        'Resposta do servidor:',
        error.response?.data
      );

      console.error(
        'Status HTTP:',
        error.response?.status
      );

      toast.error(
        'Ocorreu um erro ao atualizar o nível de acesso.',
        {
          id: toastId
        }
      );
    }
  };

  // Função para editar status do feedback
  const editarStatusFeedback = async (feedback) => {
    const ativando =
      feedback.statusFeedback !== "ATIVO";

    const novoStatus = ativando
      ? "ATIVO"
      : "INATIVO";

    const result = await Swal.fire({
      title: ativando
        ? "Ativar feedback?"
        : "Desativar feedback?",

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
        cancelButton: "swal-poppins-cancel"
      }
    });

    if (!result.isConfirmed) {
      return;
    }

    const toastId = toast.loading(
      "Atualizando status do feedback..."
    );

    try {
      console.log(
        'Alterando status do feedback:',
        feedback.id
      );

      console.log(
        'Novo status:',
        novoStatus
      );

      await axios.put(
        `http://localhost:8080/api/v1/feedback/${feedback.id}`,
        {
          statusFeedback: novoStatus
        }
      );

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === feedback.id
            ? {
                ...fb,
                statusFeedback: novoStatus
              }
            : fb
        )
      );

      toast.success(
        `Feedback ${novoStatus.toLowerCase()} com sucesso!`,
        {
          id: toastId
        }
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar status do feedback:",
        error
      );

      console.error(
        "Resposta do servidor:",
        error.response?.data
      );

      toast.error(
        "Erro ao atualizar status do feedback!",
        {
          id: toastId
        }
      );
    }
  };

  // Função para ativar/inativar usuário
  const editarStatus = async (id) => {
    const toastId = toast.loading(
      'Atualizando status do usuário...'
    );

    console.log(
      'Alterando status do usuário:',
      id
    );

    console.log(
      'Status atual:',
      usuarioStatus
    );

    try {
      const response =
        usuarioStatus === 'ATIVO'
          ? await usuarioService.inativar(id)
          : await usuarioService.ativar(id);

      console.log(
        'Resposta da alteração de status:',
        response.data
      );

      const novoStatus = normalizeStatusUsuario(
        response.data.statusUsuario
      );

      setUsuarioStatus(novoStatus);

      toast.success(
        'Status atualizado com sucesso!',
        {
          id: toastId
        }
      );

      console.log(
        'Novo status do usuário:',
        novoStatus
      );
    } catch (error) {
      console.error(
        'Erro ao editar status:',
        error
      );

      console.error(
        'Resposta do servidor:',
        error.response?.data
      );

      console.error(
        'Status HTTP:',
        error.response?.status
      );

      toast.error(
        'Erro ao atualizar status do usuário.',
        {
          id: toastId
        }
      );
    }
  };

  if (!usuario) {
    return (
      <div>
        Nenhum usuário encontrado.
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="devadm-container">

      <h1 className="devadm-h1">
        INFORMAÇÕES DO USUÁRIO
      </h1>

      <h3>
        Apenas administradores podem visualizar estas informações.
      </h3>

      <p className="devadm-label">
        NOME
      </p>

      <input
        className="devadm-input"
        type="text"
        value={usuario.nome || ''}
        disabled
      />

      <p className="devadm-label">
        EMAIL
      </p>

      <input
        className="devadm-input"
        type="email"
        value={getUsuarioEmail(usuario)}
        disabled
      />

      <p className="devadm-label">
        Nível de acesso
      </p>

      <div className="devadm-dropdown">

        <button
          className="btn"
          onClick={() =>
            setDropdownOpen(!dropdownOpen)
          }
        >
          {nivel}

          <MdOutlineKeyboardArrowDown
            className="devadm-icon"
          />
        </button>

        {dropdownOpen && (
          <div className="devadm-dropdown-menu">

            {['ADMIN', 'CLIENTE'].map((option) => (
              <div
                key={option}
                className="devadm-dropdown-item"
                onClick={() => {
                  editarNivel(
                    usuario.id,
                    option
                  );

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

      <h2>
        Feedbacks & Ocorrências
      </h2>

      {feedbacks.length > 0 ? (
        feedbacks.map((fb) => (
          <div
            key={fb.id}
            className={`devadm-feedback-card devview-feedback-card ${
              fb.tipoFeedback === 'FEEDBACK'
                ? 'feedback'
                : 'denuncia'
            } ${
              fb.statusFeedback === "INATIVO"
                ? "inactive"
                : ""
            }`}
          >

            <div className="devview-feedback-header">

              <div className="devview-feedback-user">

                <div className="devview-feedback-avatar">
                  {getInicialFeedback(
                    getNomeFeedback(fb, {
                      [Number(usuario.id)]:
                        usuario.nome
                    })
                  )}
                </div>

                <div>
                  <strong>
                    {getNomeFeedback(fb, {
                      [Number(usuario.id)]:
                        usuario.nome
                    })}
                  </strong>

                  <span>
                    {formatTempoFeedback(
                      fb.dataCadastro
                    )}
                  </span>
                </div>

              </div>

              <label
                className="devadm-feedback-switch"
                title={
                  fb.statusFeedback === "ATIVO"
                    ? "Desativar feedback"
                    : "Ativar feedback"
                }
              >
                <input
                  type="checkbox"
                  checked={
                    fb.statusFeedback === "ATIVO"
                  }
                  onChange={() =>
                    editarStatusFeedback(fb)
                  }
                />
              </label>

            </div>

            <h3>
              {fb.titulo}
            </h3>

            <p>
              Para:{' '}
              <Link
                to={`/dev-view-prestador/${Number(
                  fb.prestadorId
                )}`}
              >
                {
                  prestadoresInfo[
                    Number(fb.prestadorId)
                  ]?.nome ||
                  "Prestador sem nome"
                }
              </Link>
            </p>

            <p
              style={{
                whiteSpace: "pre-line",
                overflowWrap: "anywhere"
              }}
            >
              {breakLineEveryNChars(
                fb.descricao,
                70
              )}
            </p>

            <p>
              Nota:{' '}

              {getNotaInteira(fb.nota) > 0
                ? Array.from(
                    {
                      length: getNotaInteira(
                        fb.nota
                      )
                    },
                    (_, index) => (
                      <MdStars
                        key={index}
                      />
                    )
                  )
                : formatNotaFeedback(
                    fb.nota
                  )}
            </p>

          </div>
        ))
      ) : (
        <p>
          Nenhum feedback encontrado.
        </p>
      )}

      <button
        className={`devadm-status-btn ${
          usuarioStatus === 'ATIVO'
            ? 'ativo'
            : 'inativo'
        }`}
        onClick={() =>
          editarStatus(usuario.id)
        }
      >
        {usuarioStatus === 'ATIVO'
          ? 'Conta Ativa'
          : 'Conta Inativa'}
      </button>

    </div>
  );
};

export default DevViewADM;