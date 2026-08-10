import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdmUserComponent.css';
import axios from 'axios';
import {
  getUsuarioEmail,
  normalizeStatusUsuario,
  usuarioService
} from '../../../services/usuarioService';
import { toast } from 'sonner';
import { FaEye } from 'react-icons/fa';

const AdmUserComponent = ({ termoBusca }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [statusPrestadorPorUsuarioId, setStatusPrestadorPorUsuarioId] = useState({});

  const navigate = useNavigate();

  // =========================================================
  // NORMALIZA STATUS
  // =========================================================

  const normalizeStatus = (status, fallback = '') => {
    return String(status ?? fallback)
      .trim()
      .toUpperCase();
  };

  // =========================================================
  // OBTÉM STATUS QUE SERÁ EXIBIDO NA TABELA
  // =========================================================

  const getStatusExibicao = (usuario) => {
    const nivel = normalizeStatus(usuario?.nivelAcesso);

    /*
     * Prestadores possuem um status próprio.
     * Portanto, o status do Prestador tem prioridade.
     */
    if (nivel === 'PRESTADOR') {
      const statusPrestador = normalizeStatus(
        statusPrestadorPorUsuarioId[Number(usuario?.id)],
        ''
      );

      if (statusPrestador === 'EM_ANALISE') {
        return 'EM_ANALISE';
      }

      if (statusPrestador === 'INATIVO') {
        return 'INATIVO';
      }

      if (statusPrestador === 'ATIVO') {
        return 'ATIVO';
      }
    }

    /*
     * Usuários comuns usam statusUsuario.
     */
    const statusUsuario = normalizeStatusUsuario(
      usuario?.statusUsuario,
      'INATIVO'
    );

    return statusUsuario;
  };

  // =========================================================
  // VERIFICA SE ESTÁ EM ANÁLISE
  // =========================================================

  const usuarioEmAnalise = (usuario) => {
    return getStatusExibicao(usuario) === 'EM_ANALISE';
  };

  // =========================================================
  // CARREGAR USUÁRIOS
  // =========================================================

  const carregarUsuarios = async () => {
    console.log('========================================');
    console.log('[AdmUserComponent] Iniciando carregamento');
    console.log('========================================');

    try {
      const [respostaUsuarios, respostaPrestadores] = await Promise.all([
        usuarioService.listarTodos(),
        axios.get('http://localhost:8080/api/v1/prestador')
      ]);

      console.log(
        '[AdmUserComponent] Resposta usuários:',
        respostaUsuarios.data
      );

      console.log(
        '[AdmUserComponent] Resposta prestadores:',
        respostaPrestadores.data
      );

      const usuariosData = Array.isArray(respostaUsuarios.data)
        ? respostaUsuarios.data
        : [];

      const prestadoresData = Array.isArray(respostaPrestadores.data)
        ? respostaPrestadores.data
        : [];

      // =====================================================
      // MAPEAR STATUS DOS PRESTADORES
      // =====================================================

      const statusPorUsuario = prestadoresData.reduce(
        (acc, prestador) => {
          const usuarioId = Number(
            prestador?.usuario?.id ??
            prestador?.usuario_id ??
            prestador?.usuarioId
          );

          if (!Number.isNaN(usuarioId) && usuarioId > 0) {
            acc[usuarioId] = normalizeStatus(
              prestador?.statusPrestador,
              'EM_ANALISE'
            );
          }

          return acc;
        },
        {}
      );

      console.log(
        '[AdmUserComponent] Status dos prestadores por usuário:',
        statusPorUsuario
      );

      setStatusPrestadorPorUsuarioId(statusPorUsuario);

      // =====================================================
      // NORMALIZAR USUÁRIOS
      // =====================================================

      const usuariosNormalizados = usuariosData.map((usuario) => ({
        ...usuario,
        id: Number(usuario.id),
        nome: usuario.nome || 'Usuário sem nome',
        username: usuario.username || usuario.email || '',
        nivelAcesso: normalizeStatus(usuario.nivelAcesso),
        statusUsuario: normalizeStatusUsuario(
          usuario.statusUsuario,
          'INATIVO'
        )
      }));

      console.log(
        '[AdmUserComponent] Usuários normalizados:',
        usuariosNormalizados
      );

      setUsuarios(usuariosNormalizados);
      setUsuariosFiltrados(usuariosNormalizados);

      toast.success('Usuários carregados');
    } catch (error) {
      console.error(
        '[AdmUserComponent] Erro ao carregar usuários:',
        error
      );

      console.error(
        '[AdmUserComponent] Response:',
        error?.response?.data
      );

      console.error(
        '[AdmUserComponent] Status HTTP:',
        error?.response?.status
      );

      toast.warning('Falha ao carregar usuários');
    }
  };

  // =========================================================
  // CARREGAMENTO INICIAL
  // =========================================================

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // =========================================================
  // ABRIR / FECHAR DROPDOWN
  // =========================================================

  const toggleDropdown = (menu) => {
    setOpenDropdown((atual) =>
      atual === menu ? null : menu
    );
  };

  // =========================================================
  // FILTROS
  // =========================================================

  const aplicarFiltro = (tipo, valor) => {
    console.log(
      '[AdmUserComponent] Aplicando filtro:',
      tipo,
      valor
    );

    let lista = [...usuarios];

    // ORDEM ALFABÉTICA
    if (tipo === 'ordem') {
      if (valor === 'A-Z') {
        lista.sort((a, b) =>
          a.nome.localeCompare(
            b.nome,
            'pt-BR',
            { sensitivity: 'base' }
          )
        );
      }

      if (valor === 'Z-A') {
        lista.sort((a, b) =>
          b.nome.localeCompare(
            a.nome,
            'pt-BR',
            { sensitivity: 'base' }
          )
        );
      }
    }

    // NÍVEL DE ACESSO
    if (tipo === 'nivel') {
      lista = lista.filter(
        (usuario) =>
          normalizeStatus(usuario.nivelAcesso) ===
          normalizeStatus(valor)
      );
    }

    // STATUS
    if (tipo === 'status') {
      if (valor === 'ATIVO') {
        lista = lista.filter(
          (usuario) =>
            getStatusExibicao(usuario) === 'ATIVO'
        );
      }

      if (valor === 'INATIVO') {
        lista = lista.filter(
          (usuario) =>
            getStatusExibicao(usuario) === 'INATIVO'
        );
      }

      if (valor === 'EM ANÁLISE') {
        lista = lista.filter(
          (usuario) =>
            getStatusExibicao(usuario) === 'EM_ANALISE'
        );
      }
    }

    /*
     * Independente do filtro escolhido,
     * usuários em análise sempre ficam no topo.
     */
    lista.sort((a, b) => {
      const aAnalise = usuarioEmAnalise(a);
      const bAnalise = usuarioEmAnalise(b);

      if (aAnalise && !bAnalise) {
        return -1;
      }

      if (!aAnalise && bAnalise) {
        return 1;
      }

      return 0;
    });

    console.log(
      '[AdmUserComponent] Resultado do filtro:',
      lista
    );

    setUsuariosFiltrados(lista);
    setOpenDropdown(null);
  };

  // =========================================================
  // LIMPAR FILTROS
  // =========================================================

  const limparFiltros = () => {
    console.log('[AdmUserComponent] Limpando filtros');

    const listaOrdenada = [...usuarios].sort((a, b) => {
      const aAnalise = usuarioEmAnalise(a);
      const bAnalise = usuarioEmAnalise(b);

      if (aAnalise && !bAnalise) return -1;
      if (!aAnalise && bAnalise) return 1;

      return 0;
    });

    setUsuariosFiltrados(listaOrdenada);
    setOpenDropdown(null);
  };

  // =========================================================
  // VISUALIZAR USUÁRIO
  // =========================================================

  const handleVisualizar = async (usuario) => {
    console.log(
      '[AdmUserComponent] Visualizando usuário:',
      usuario
    );

    const nivel = normalizeStatus(usuario.nivelAcesso);

    // ADMIN
    if (nivel === 'ADMIN') {
      navigate('/dev-view-adm', {
        state: { usuario }
      });

      return;
    }

    // PRESTADOR
    if (nivel === 'PRESTADOR') {
      try {
        console.log(
          '[AdmUserComponent] Buscando prestador vinculado ao usuário:',
          usuario.id
        );

        const res = await axios.get(
          'http://localhost:8080/api/v1/prestador'
        );

        const prestadores = Array.isArray(res.data)
          ? res.data
          : [];

        const prestador = prestadores.find(
          (p) =>
            Number(
              p?.usuario?.id ??
              p?.usuario_id ??
              p?.usuarioId
            ) === Number(usuario.id)
        );

        console.log(
          '[AdmUserComponent] Prestador encontrado:',
          prestador
        );

        if (prestador) {
          navigate(
            `/dev-view-prestador/${prestador.id}`
          );
        } else {
          toast.warning(
            'Prestador vinculado não encontrado para este usuário.'
          );
        }
      } catch (error) {
        console.error(
          '[AdmUserComponent] Erro ao buscar prestador:',
          error
        );

        toast.error(
          'Erro ao buscar prestador vinculado.'
        );
      }

      return;
    }

    // CLIENTE
    if (nivel === 'CLIENTE') {
      navigate('/dev-view-client', {
        state: { usuario }
      });

      return;
    }

    toast.warning(
      `Nível de acesso não reconhecido: ${nivel}`
    );
  };

  // =========================================================
  // BUSCA POR NOME
  // =========================================================

  useEffect(() => {
    const termo = String(termoBusca || '')
      .trim()
      .toLowerCase();

    if (termo === '') {
      const listaOrdenada = [...usuarios].sort((a, b) => {
        const aAnalise = usuarioEmAnalise(a);
        const bAnalise = usuarioEmAnalise(b);

        if (aAnalise && !bAnalise) return -1;
        if (!aAnalise && bAnalise) return 1;

        return 0;
      });

      setUsuariosFiltrados(listaOrdenada);

      return;
    }

    const filtrados = usuarios.filter((usuario) => {
      const nome = String(usuario.nome || '')
        .toLowerCase();

      const email = getUsuarioEmail(usuario)
        .toLowerCase();

      return (
        nome.includes(termo) ||
        email.includes(termo)
      );
    });

    /*
     * Mesmo durante a busca, usuários em análise
     * continuam aparecendo primeiro.
     */
    filtrados.sort((a, b) => {
      const aAnalise = usuarioEmAnalise(a);
      const bAnalise = usuarioEmAnalise(b);

      if (aAnalise && !bAnalise) return -1;
      if (!aAnalise && bAnalise) return 1;

      return 0;
    });

    setUsuariosFiltrados(filtrados);
  }, [
    termoBusca,
    usuarios,
    statusPrestadorPorUsuarioId
  ]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* ================= DROPDOWNS ================= */}

      <div className="auc-dropdown-bar">

        {/* ORDEM */}

        <div className="auc-dropdown">
          <button
            onClick={() =>
              toggleDropdown('ordem')
            }
            className="auc-ordem"
          >
            ORDEM
          </button>

          {openDropdown === 'ordem' && (
            <div className="auc-menu">
              <div
                onClick={() =>
                  aplicarFiltro('ordem', 'A-Z')
                }
              >
                A - Z
              </div>

              <div
                onClick={() =>
                  aplicarFiltro('ordem', 'Z-A')
                }
              >
                Z - A
              </div>
            </div>
          )}
        </div>

        {/* NÍVEL DE ACESSO */}

        <div className="auc-dropdown">
          <button
            onClick={() =>
              toggleDropdown('nivel')
            }
            className="auc-status"
          >
            NÍVEL DE ACESSO
          </button>

          {openDropdown === 'nivel' && (
            <div className="auc-menu">
              <div
                onClick={() =>
                  aplicarFiltro(
                    'nivel',
                    'ADMIN'
                  )
                }
              >
                ADMIN
              </div>

              <div
                onClick={() =>
                  aplicarFiltro(
                    'nivel',
                    'PRESTADOR'
                  )
                }
              >
                PRESTADOR
              </div>

              <div
                onClick={() =>
                  aplicarFiltro(
                    'nivel',
                    'CLIENTE'
                  )
                }
              >
                CLIENTE
              </div>
            </div>
          )}
        </div>

        {/* STATUS */}

        <div className="auc-dropdown">
          <button
            onClick={() =>
              toggleDropdown('status')
            }
            className="auc-btn"
          >
            STATUS
          </button>

          {openDropdown === 'status' && (
            <div className="auc-menu">
              <div
                onClick={() =>
                  aplicarFiltro(
                    'status',
                    'ATIVO'
                  )
                }
              >
                ATIVO
              </div>

              <div
                onClick={() =>
                  aplicarFiltro(
                    'status',
                    'INATIVO'
                  )
                }
              >
                INATIVO
              </div>

              <div
                onClick={() =>
                  aplicarFiltro(
                    'status',
                    'EM ANÁLISE'
                  )
                }
              >
                EM ANÁLISE
              </div>
            </div>
          )}
        </div>

        {/* LIMPAR */}

        <button
          onClick={limparFiltros}
          className="auc-clear"
        >
          LIMPAR
        </button>
      </div>

      {/* ================= TABELA ================= */}

      <div className="auc-container">

        <div className="auc-table">

          <div className="auc-header">
            <div className="auc-col id">
              ID
            </div>

            <div className="auc-col nome">
              Nome
            </div>

            <div className="auc-col email">
              Email
            </div>

            <div className="auc-col nivel">
              Nível de acesso
            </div>

            <div className="auc-col status">
              Status
            </div>

            <div className="auc-col acoes">
              Ações
            </div>
          </div>

          {usuariosFiltrados.length === 0 ? (

            <div className="auc-empty">
              Nenhum usuário encontrado.
            </div>

          ) : (

            usuariosFiltrados.map(
              (usuario, index) => {

                const status =
                  getStatusExibicao(usuario);

                const emAnalise =
                  status === 'EM_ANALISE';

                return (
                  <div
                    className={`auc-row ${
                      emAnalise
                        ? 'auc-row-analise'
                        : ''
                    }`}
                    key={
                      usuario.id ||
                      index
                    }
                  >

                    {/* ID */}

                    <div className="auc-col id">
                      {usuario.id}
                    </div>

                    {/* NOME */}

                    <div
                      className={`auc-col nome ${
                        emAnalise
                          ? 'auc-nome-analise'
                          : ''
                      }`}
                    >
                      {emAnalise && (
                        <span
                          className="auc-alert-icon"
                          title="Usuário aguardando análise"
                        >
                          !
                        </span>
                      )}

                      <span>
                        {usuario.nome}
                      </span>
                    </div>

                    {/* EMAIL */}

                    <div className="auc-col email">
                      {getUsuarioEmail(
                        usuario
                      )}
                    </div>

                    {/* NÍVEL */}

                    <div className="auc-col nivel">
                      {usuario.nivelAcesso}
                    </div>

                    {/* STATUS */}

                    <div
                      className={`auc-col status ${
                        status === 'ATIVO'
                          ? 'ativo'
                          : status === 'EM_ANALISE'
                          ? 'analise'
                          : 'inativo'
                      }`}
                    >
                      {status ===
                      'EM_ANALISE'
                        ? 'Em análise'
                        : status ===
                          'ATIVO'
                        ? 'Ativo'
                        : 'Inativo'}
                    </div>

                    {/* AÇÕES */}

                    <div className="auc-col acoes">

                      <button
                        className="btn-visualizar"
                        onClick={() =>
                          handleVisualizar(
                            usuario
                          )
                        }
                      >
                        <FaEye />

                        Visualizar
                      </button>

                    </div>

                  </div>
                );
              }
            )

          )}

        </div>

      </div>
    </>
  );
};

export default AdmUserComponent;