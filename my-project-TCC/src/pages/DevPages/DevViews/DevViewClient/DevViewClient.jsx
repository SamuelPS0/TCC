import React, { useState, useEffect } from 'react';

import {
  Link,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import HeaderSwitcher from '../../../../Components/HeaderSwitcher';

import {
  MdOutlineKeyboardArrowDown,
  MdStars
} from 'react-icons/md';

import { toast } from 'sonner';

import axios from 'axios';

import Swal from 'sweetalert2';

import {
  getUsuarioEmail,
  normalizeStatusUsuario,
  usuarioService
} from '../../../../services/usuarioService';

import Loading from '../../../../Components/Loading/Loading';

import {
  breakLineEveryNChars
} from '../../../../utils/formatFeedbackText';

import {
  getNomeFeedback,
  getInicialFeedback,
  formatNotaFeedback,
  formatTempoFeedback,
  getNotaInteira
} from '../../../../utils/devviewFeedback';

import '../feedbackShared.css';
import '../DevViewPrestador/DevViewPrestador.css';
import './DevViewClient.css';


const DevViewClient = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { usuarioId } = useParams();

  /*
   * ============================================================
   * USUÁRIO
   * ============================================================
   *
   * A tela pode receber o usuário pelo location.state,
   * mas também consegue buscá-lo pelo ID da URL.
   *
   * Exemplo:
   *
   * /dev-view-client/2
   *
   * Isso evita o problema de perder o usuário ao atualizar
   * a página.
   */

  const usuarioState = location.state?.usuario || null;

  const [usuario, setUsuario] = useState(usuarioState);

  const [carregandoUsuario, setCarregandoUsuario] = useState(
    !usuarioState
  );


  /*
   * ============================================================
   * CONVERSÃO DO NÍVEL DE ACESSO
   * ============================================================
   *
   * Backend:
   *
   * ADMIN
   * USER
   *
   * DevView:
   *
   * ADMIN
   * CLIENTE
   *
   * Portanto:
   *
   * USER <-> CLIENTE
   */

  const normalizeNivelAcesso = (nivelAcesso) => {

    const nivelNormalizado = String(nivelAcesso || '')
      .trim()
      .toUpperCase();

    if (nivelNormalizado === 'ADMIN') {
      return 'ADMIN';
    }

    if (
      nivelNormalizado === 'USER' ||
      nivelNormalizado === 'CLIENTE'
    ) {
      return 'CLIENTE';
    }

    return 'CLIENTE';
  };


  /*
   * ============================================================
   * CONVERTE NÍVEL PARA O BACKEND
   * ============================================================
   */

  const nivelParaBackend = (nivelAcesso) => {

    const nivelNormalizado = String(nivelAcesso || '')
      .trim()
      .toUpperCase();

    if (nivelNormalizado === 'ADMIN') {
      return 'ADMIN';
    }

    if (
      nivelNormalizado === 'CLIENTE' ||
      nivelNormalizado === 'USER'
    ) {
      return 'USER';
    }

    return 'USER';
  };


  /*
   * ============================================================
   * STATES
   * ============================================================
   */

  const [nivel, setNivel] = useState(
    normalizeNivelAcesso(usuario?.nivelAcesso)
  );

  const [usuarioStatus, setUsuarioStatus] = useState(
    normalizeStatusUsuario(usuario?.statusUsuario)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [feedbacks, setFeedbacks] = useState([]);

  const [prestadoresInfo, setPrestadoresInfo] = useState({});


  /*
   * ============================================================
   * BUSCAR USUÁRIO
   * ============================================================
   */

  useEffect(() => {

    const carregarUsuario = async () => {

      /*
       * Se o usuário já veio pelo state,
       * não precisamos fazer outra requisição.
       */

      if (usuarioState) {

        setUsuario(usuarioState);

        setNivel(
          normalizeNivelAcesso(
            usuarioState.nivelAcesso
          )
        );

        setUsuarioStatus(
          normalizeStatusUsuario(
            usuarioState.statusUsuario
          )
        );

        setCarregandoUsuario(false);

        return;
      }


      /*
       * Se não existe ID na URL,
       * não temos como buscar o usuário.
       */

      if (!usuarioId) {

        console.error(
          '[DevViewClient] ID do usuário não encontrado na URL.'
        );

        setCarregandoUsuario(false);

        return;
      }


      try {

        console.log(
          '[DevViewClient] Buscando usuário pelo ID:',
          usuarioId
        );


        const response =
          await usuarioService.buscarPorId(usuarioId);


        console.log(
          '[DevViewClient] Usuário encontrado:',
          response.data
        );


        setUsuario(response.data);


        setNivel(
          normalizeNivelAcesso(
            response.data?.nivelAcesso
          )
        );


        setUsuarioStatus(
          normalizeStatusUsuario(
            response.data?.statusUsuario
          )
        );


      } catch (error) {

        console.error(
          '[DevViewClient] Erro ao buscar usuário:',
          error
        );

        toast.error(
          'Não foi possível carregar os dados do cliente.'
        );

      } finally {

        setCarregandoUsuario(false);

      }

    };


    carregarUsuario();

  }, [usuarioId, usuarioState]);


  /*
   * ============================================================
   * BUSCAR FEEDBACKS
   * ============================================================
   */

  useEffect(() => {

    if (!usuario?.id) {
      return;
    }


    const fetchFeedbacks = async () => {

      try {

        /*
         * ========================================================
         * BUSCAR PRESTADORES
         * ========================================================
         */

        const prestadoresRes = await axios.get(
          'http://localhost:8080/api/v1/prestador'
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
                'Prestador sem nome'
            }

          ])

        );


        setPrestadoresInfo(prestadoresMap);


        /*
         * ========================================================
         * BUSCAR FEEDBACKS
         * ========================================================
         */

        const res = await axios.get(
          'http://localhost:8080/api/v1/feedback'
        );


        const feedbacksUsuario =
          (res.data || []).filter(
            (f) =>
              Number(f.usuarioId) ===
              Number(usuario.id)
          );


        setFeedbacks(feedbacksUsuario);


      } catch (error) {

        console.error(
          'Erro ao buscar feedbacks:',
          error
        );

      }

    };


    fetchFeedbacks();

  }, [usuario?.id]);


  /*
   * ============================================================
   * EDITAR NÍVEL DE ACESSO
   * ============================================================
   */

  const editarNivel = async (id, novoNivel) => {

    const toastId = toast.loading(
      'Atualizando nível de acesso...'
    );


    const nivelBackend =
      nivelParaBackend(novoNivel);


    try {

      await usuarioService.editar(

        id,

        {
          nome: usuario.nome,

          username: getUsuarioEmail(usuario),

          nivelAcesso: nivelBackend
        }

      );


      /*
       * Atualiza o estado local.
       */

      setNivel(
        normalizeNivelAcesso(nivelBackend)
      );


      /*
       * Atualiza também o usuário local,
       * para manter os dados sincronizados.
       */

      setUsuario((prev) => ({
        ...prev,

        nivelAcesso: nivelBackend
      }));


      toast.success(
        'Nível de acesso atualizado!',
        {
          id: toastId
        }
      );


    } catch (error) {

      console.error(
        'Erro ao atualizar nível:',
        error
      );


      toast.error(
        'Erro ao atualizar nível.',
        {
          id: toastId
        }
      );

    }

  };


  /*
   * ============================================================
   * EDITAR STATUS DO FEEDBACK
   * ============================================================
   */

  const editarStatusFeedback = async (feedback) => {

    const ativando =
      feedback.statusFeedback !== 'ATIVO';


    const novoStatus =
      ativando
        ? 'ATIVO'
        : 'INATIVO';


    const result = await Swal.fire({

      title:
        ativando
          ? 'Ativar feedback?'
          : 'Desativar feedback?',

      text:
        ativando
          ? 'O feedback ficará visível novamente.'
          : 'O feedback deixará de aparecer para os usuários.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#26c26a',

      cancelButtonColor: '#e74c3c',

      confirmButtonText: 'Sim',

      cancelButtonText: 'Cancelar',

      customClass: {

        popup: 'swal-poppins-popup',

        title: 'swal-poppins-title',

        htmlContainer: 'swal-poppins-text',

        confirmButton: 'swal-poppins-confirm',

        cancelButton: 'swal-poppins-cancel'

      }

    });


    if (!result.isConfirmed) {
      return;
    }


    const toastId = toast.loading(
      'Atualizando status do feedback...'
    );


    try {

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
        'Erro ao atualizar status do feedback:',
        error
      );


      toast.error(
        'Erro ao atualizar status do feedback!',
        {
          id: toastId
        }
      );

    }

  };


  /*
   * ============================================================
   * ABRIR DEVVIEW DE OUTRO USUÁRIO
   * ============================================================
   */

  const abrirDevViewUsuario = async (id) => {

    if (!id) {
      return;
    }


    try {

      const { data } =
        await usuarioService.buscarPorId(id);


      navigate(
        `/dev-view-client/${data.id}`,
        {
          state: {
            usuario: data
          }
        }
      );


    } catch (error) {

      console.error(
        'Erro ao abrir DevView do usuário:',
        error
      );


      toast.error(
        'Não foi possível abrir o DevView do usuário.'
      );

    }

  };


  /*
   * ============================================================
   * ALTERAR STATUS DO USUÁRIO
   * ============================================================
   */

  const editarStatus = async (id) => {

    const toastId = toast.loading(
      'Atualizando status do usuário...'
    );


    try {

      const response =
        usuarioStatus === 'ATIVO'

          ? await usuarioService.inativar(id)

          : await usuarioService.ativar(id);


      const novoStatus =
        normalizeStatusUsuario(
          response.data?.statusUsuario
        );


      setUsuarioStatus(novoStatus);


      /*
       * Atualiza o usuário local também.
       */

      setUsuario((prev) => ({

        ...prev,

        statusUsuario:
          response.data?.statusUsuario

      }));


      toast.success(
        'Status atualizado com sucesso!',
        {
          id: toastId
        }
      );


    } catch (error) {

      console.error(
        'Erro ao atualizar status:',
        error
      );


      toast.error(
        'Erro ao atualizar status.',
        {
          id: toastId
        }
      );

    }

  };


  /*
   * ============================================================
   * LOADING DO USUÁRIO
   * ============================================================
   */

  if (carregandoUsuario) {
    return <Loading />;
  }


  /*
   * ============================================================
   * USUÁRIO NÃO ENCONTRADO
   * ============================================================
   */

  if (!usuario) {

    return (

      <div>

        Nenhum usuário encontrado.

      </div>

    );

  }


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (

    <div className="devclient-page">

      <HeaderSwitcher />


      <div className="devclient-container">


        <h1 className="devclient-h1">
          INFORMAÇÕES DO CLIENTE
        </h1>


        <h3>
          Apenas administradores podem visualizar estas informações.
        </h3>


        {/* =====================================================
            NOME
        ====================================================== */}

        <p className="devclient-label">
          NOME
        </p>


        <input
          className="devclient-input"
          type="text"
          value={usuario.nome || ''}
          disabled
        />


        {/* =====================================================
            EMAIL
        ====================================================== */}

        <p className="devclient-label">
          EMAIL
        </p>


        <input
          className="devclient-input"
          type="email"
          value={getUsuarioEmail(usuario)}
          disabled
        />


        {/* =====================================================
            NÍVEL DE ACESSO
        ====================================================== */}

        <p className="devclient-label">
          Nível de acesso
        </p>


        <div className="devclient-dropdown">

          <button
            type="button"
            className="btn"
            onClick={() =>
              setDropdownOpen(!dropdownOpen)
            }
          >

            {nivel}

            <MdOutlineKeyboardArrowDown
              className="devclient-icon"
            />

          </button>


          {dropdownOpen && (

            <div className="devclient-dropdown-menu">

              {['ADMIN', 'CLIENTE'].map((option) => (

                <div
                  key={option}
                  className="devclient-dropdown-item"

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


        {/* =====================================================
            FEEDBACKS
        ====================================================== */}

        <h2 className="feedback-title">
          Feedbacks & Ocorrências
        </h2>


        <div className="prestview-feedbacks">

          {feedbacks.length === 0 ? (

            <p>
              Nenhum feedback carregado.
            </p>

          ) : (

            feedbacks.map((fb) => (

              <div
                key={fb.id}

                className={`
                  prestview-feedback-card
                  devview-feedback-card
                  ${
                    fb.tipoFeedback === 'FEEDBACK'
                      ? 'feedback'
                      : 'denuncia'
                  }
                  ${
                    fb.statusFeedback === 'INATIVO'
                      ? 'inactive'
                      : ''
                  }
                `}
              >

                {/* =================================================
                    CABEÇALHO
                ================================================== */}

                <div className="devview-feedback-header">


                  <div className="devview-feedback-user">

                    <span className="devview-feedback-avatar">

                      {getInicialFeedback(

                        getNomeFeedback(

                          fb,

                          {
                            [Number(usuario.id)]:
                              usuario.nome
                          }

                        )

                      )}

                    </span>


                    <div>

                      <h3 className="devview-feedback-name">

                        <button
                          type="button"
                          className="devview-feedback-name-link"

                          onClick={() =>
                            abrirDevViewUsuario(
                              fb.usuarioId
                            )
                          }
                        >

                          {getNomeFeedback(

                            fb,

                            {
                              [Number(usuario.id)]:
                                usuario.nome
                            }

                          )}

                        </button>

                      </h3>


                      <p className="devview-feedback-time">

                        {formatTempoFeedback(
                          fb.dataCadastro
                        )}

                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      STATUS DO FEEDBACK
                  ================================================== */}

                  <div className="feedback-status-row">

                    <label
                      className="feedback-switch"

                      title={
                        fb.statusFeedback === 'ATIVO'
                          ? 'Desativar feedback'
                          : 'Ativar feedback'
                      }
                    >

                      <input
                        type="checkbox"

                        checked={
                          fb.statusFeedback === 'ATIVO'
                        }

                        onChange={() =>
                          editarStatusFeedback(fb)
                        }
                      />

                      <span className="feedback-slider"></span>

                    </label>

                  </div>


                </div>


                {/* =================================================
                    TÍTULO
                ================================================== */}

                <h4>
                  {fb.titulo}
                </h4>


                {/* =================================================
                    PRESTADOR
                ================================================== */}

                <p className="devview-feedback-target">

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
                      'Prestador sem nome'
                    }

                  </Link>

                </p>


                {/* =================================================
                    DESCRIÇÃO
                ================================================== */}

                <p
                  style={{
                    whiteSpace: 'pre-line',
                    overflowWrap: 'anywhere'
                  }}
                >

                  {breakLineEveryNChars(
                    fb.descricao,
                    70
                  )}

                </p>


                {/* =================================================
                    NOTA
                ================================================== */}

                <p className="devview-feedback-note">

                  <strong>
                    Nota:
                  </strong>

                  {' '}

                  {getNotaInteira(fb.nota) > 0

                    ? Array.from(
                        {
                          length:
                            getNotaInteira(
                              fb.nota
                            )
                        },

                        (_, index) => (

                          <MdStars
                            key={index}
                            className="devview-feedback-star"
                          />

                        )
                      )

                    : formatNotaFeedback(
                        fb.nota
                      )

                  }

                </p>


              </div>

            ))

          )}

        </div>


        {/* =====================================================
            STATUS DA CONTA
        ====================================================== */}

        <button
          type="button"

          className={`
            devclient-status-btn
            ${
              usuarioStatus === 'ATIVO'
                ? 'ativo'
                : 'inativo'
            }
          `}

          onClick={() =>
            editarStatus(usuario.id)
          }
        >

          {usuarioStatus === 'ATIVO'
            ? 'Conta Ativa'
            : 'Conta Inativa'
          }

        </button>


      </div>

    </div>

  );

};


export default DevViewClient;