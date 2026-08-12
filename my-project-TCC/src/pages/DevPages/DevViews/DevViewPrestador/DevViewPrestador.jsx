import React, { useEffect, useState } from "react";

import axios from "axios";

import { usuarioService } from "../../../../services/usuarioService";

import { Link, useNavigate, useParams } from "react-router-dom";

import HeaderSwitcher from "../../../../Components/HeaderSwitcher";

import { IoPersonCircleOutline } from "react-icons/io5";

import { IoMdImage, IoIosCall } from "react-icons/io";

import { FaMapMarkerAlt, FaList } from "react-icons/fa";

import { toast } from "sonner";

import Swal from "sweetalert2";

import { MdStars } from "react-icons/md";

import Loading from "../../../../Components/Loading/Loading";

import "./DevViewPrestador.css";

import { breakLineEveryNChars } from "../../../../utils/formatFeedbackText";

import {
  getNomeFeedback,
  getInicialFeedback,
  formatNotaFeedback,
  formatTempoFeedback,
  getNotaInteira,
} from "../../../../utils/devviewFeedback";

import "../feedbackShared.css";

// ======================================================
// IMAGENS ESPECIAIS DA SICRANA
// ======================================================

import SicranaPerfilImg from "../../../../img/ellipse.png";
import SicranaServicoImg from "../../../../img/crosant.png";

// ======================================================
// NORMALIZAÇÃO DE IMAGENS
// ======================================================

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

// ======================================================
// PRESTADOR
// ======================================================

const getPrestadorId = (item = {}) =>
  Number(
    item.prestadorId ??
      item.prestador_id ??
      item.prestador?.id
  );

const normalizeStatus = (status, fallback = "") =>
  String(status ?? fallback).trim().toUpperCase();

const isAtivo = (status) =>
  normalizeStatus(status, "INATIVO") === "ATIVO";

const getContatoLabel = (contato = {}) =>
  contato.tipoContato ??
  contato.tipo_contato ??
  contato.tipo ??
  contato.label ??
  "Contato";

const getPrestadorNome = (prestador = {}) =>
  prestador.nome ||
  prestador.usuario?.nome ||
  prestador.usuario_nome ||
  "Prestador sem nome";

// ======================================================
// IDENTIFICAÇÃO ESPECÍFICA DA SICRANA
// ======================================================
//
// A imagem especial só será utilizada quando vários dados
// do cadastro coincidirem simultaneamente.
//
// Isso evita que outro prestador com nome parecido receba
// as imagens da Sicrana.
//

const isSicrana = (prestador = {}) => {
  const nome = String(prestador.nome ?? "")
    .trim()
    .toLowerCase();

  const bairro = String(prestador.bairro ?? "")
    .trim()
    .toLowerCase();

  const cep = String(prestador.cep ?? "")
    .trim();

  const cidade = String(prestador.cidade ?? "")
    .trim()
    .toLowerCase();

  const complemento = String(prestador.complemento ?? "")
    .trim()
    .toLowerCase();

  const cpf = String(prestador.cpf ?? "")
    .trim();

  const genero = String(prestador.genero ?? "")
    .trim()
    .toLowerCase();

  const logradouro = String(prestador.logradouro ?? "")
    .trim()
    .toLowerCase();

  const numeroResidencial = String(prestador.numeroResidencial ?? "")
    .trim();

  const telefone = String(prestador.telefone ?? "")
    .trim();

  const uf = String(prestador.uf ?? "")
    .trim()
    .toLowerCase();

  const id = Number(prestador.id);

  return (
    id === 1 &&
    nome === "sicrana de oliveira" &&
    bairro === "engenho novo" &&
    cep === "01234567" &&
    cidade === "barueri" &&
    complemento === "casa 1" &&
    cpf === "12345678910" &&
    genero === "feminino" &&
    logradouro === "rua lorena" &&
    numeroResidencial === "13" &&
    telefone === "11940028922" &&
    uf === "sp"
  );
};

// ======================================================
// COMPONENTE
// ======================================================

const DevViewPrestador = () => {
  const { prestadorId } = useParams();

  const navigate = useNavigate();

  const [card, setCard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [prestadoresInfo, setPrestadoresInfo] = useState({});

  const [feedbacks, setFeedbacks] = useState([]);

  const [nomesUsuarios, setNomesUsuarios] = useState({});

  const [prestador, setPrestador] = useState(null);

  const [statusPrestador, setStatusPrestador] =
    useState("EM_ANALISE");

  // ======================================================
  // BUSCAR NOME DO USUÁRIO
  // ======================================================

  const buscarNomeUsuarioPorId = async (usuarioId) => {
    try {
      console.log("Buscando usuário:", usuarioId);

      const res = await usuarioService.buscarPorId(usuarioId);

      console.log("Resposta da API:", res.data);

      return (
        res.data?.nome ||
        `Usuário #${usuarioId}`
      );
    } catch (error) {
      console.error(
        `Erro ao buscar usuário ${usuarioId}:`,
        error
      );

      return `Usuário #${usuarioId}`;
    }
  };

  // ======================================================
  // BUSCAR PRESTADOR
  // ======================================================

  useEffect(() => {
    const fetchPrestador = async () => {
      try {
        // --------------------------------------------------
        // 1. Buscar prestador
        // --------------------------------------------------

        const prestadorRes = await axios.get(
          `http://localhost:8080/api/v1/prestador/${prestadorId}`
        );

        const prestadorData = prestadorRes.data;

        if (!prestadorData) {
          toast.error("Prestador não encontrado!");

          setLoading(false);

          return;
        }

        // --------------------------------------------------
        // Verificar se é a Sicrana
        // --------------------------------------------------

        const prestadorEspecial = isSicrana(
          prestadorData
        );

        console.log(
          "Prestador atual:",
          prestadorData
        );

        console.log(
          "É a Sicrana?",
          prestadorEspecial
        );

        // --------------------------------------------------
        // 2. Buscar serviços
        // --------------------------------------------------

        const servicosRes = await axios.get(
          "http://localhost:8080/api/v1/servico"
        );

        const servico = (servicosRes.data || []).find(
          (s) =>
            getPrestadorId(s) ===
            Number(prestadorData.id)
        );

        const usuarioPrestador =
          prestadorData.usuario ||
          servico?.prestador?.usuario ||
          {};

        // --------------------------------------------------
        // Informações do prestador
        // --------------------------------------------------

        setPrestadoresInfo({
          [Number(prestadorData.id)]: {
            ...prestadorData,

            nome: getPrestadorNome(
              prestadorData
            ),
          },
        });

        // --------------------------------------------------
        // 3. Buscar contatos ativos
        // --------------------------------------------------

        const contatosRes = await axios.get(
          "http://localhost:8080/api/v1/contato"
        );

        const contatosAtivos =
          (contatosRes.data || []).filter(
            (c) =>
              getPrestadorId(c) ===
                Number(prestadorData.id) &&
              isAtivo(c.statusContato)
          );

        // --------------------------------------------------
        // 4. Buscar feedbacks
        // --------------------------------------------------

        const feedbacksRes = await axios.get(
          "http://localhost:8080/api/v1/feedback"
        );

        const feedbacksPrestador =
          (feedbacksRes.data || []).filter(
            (f) =>
              Number(f.prestadorId) ===
                Number(prestadorData.id) &&
              f.statusFeedback
          );

        // --------------------------------------------------
        // Buscar nomes dos usuários dos feedbacks
        // --------------------------------------------------

        const idsUsuarios = [
          ...new Set(
            feedbacksPrestador
              .map((f) => f.usuarioId)
              .filter(Boolean)
          ),
        ];

        const nomesArray = await Promise.all(
          idsUsuarios.map(
            async (id) => [
              Number(id),
              await buscarNomeUsuarioPorId(id),
            ]
          )
        );

        setNomesUsuarios(
          Object.fromEntries(nomesArray)
        );

        // --------------------------------------------------
        // 5. Imagens vindas do backend
        // --------------------------------------------------

        const fotoPerfilBanco =
          getImageField(prestadorData, [
            "foto",
            "fotoPerfil",
            "imagemPerfil",
            "imagem",
          ]) ||
          getImageField(usuarioPrestador, [
            "foto",
            "fotoPerfil",
            "imagemPerfil",
            "imagem",
          ]);

        const fotoServicoBanco =
          getImageField(servico, [
            "fotoServico",
            "imagemServico",
            "foto",
            "imagem",
          ]);

        // --------------------------------------------------
        // 6. Escolher imagens
        // --------------------------------------------------
        //
        // Se for a Sicrana:
        //
        // perfil  -> ellipse.png
        // serviço -> crosant.png
        //
        // Caso contrário:
        //
        // perfil  -> banco
        // serviço -> banco
        //

        const fotoPerfil = prestadorEspecial
          ? SicranaPerfilImg
          : fotoPerfilBanco;

        const fotoServico = prestadorEspecial
          ? SicranaServicoImg
          : fotoServicoBanco;

        // --------------------------------------------------
        // 7. Montar card
        // --------------------------------------------------

        const cardData = {
          prestadorNome:
            prestadorData.nome ||
            usuarioPrestador.nome ||
            "Nome não cadastrado",

          servicoNome:
            servico?.nome ||
            "Serviço não cadastrado",

          servicoDescricao:
            servico?.descricao ||
            "Descrição não cadastrada",

          categoria:
            servico?.categoria?.nome ||
            "Categoria não cadastrada",

          cidade:
            prestadorData.cidade ||
            "Cidade não cadastrada",

          uf:
            prestadorData.uf ||
            "UF não cadastrada",

          contatos: contatosAtivos.map(
            (contato) => ({
              id:
                contato.id ??
                `${getContatoLabel(
                  contato
                )}-${contato.link}`,

              tipo:
                getContatoLabel(contato),

              link:
                contato.link ??
                contato.value ??
                contato.url ??
                "Contato sem link cadastrado",
            })
          ),

          foto: fotoPerfil,

          fotoServico: fotoServico,
        };

        // --------------------------------------------------
        // 8. Atualizar estados
        // --------------------------------------------------

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

        setFeedbacks(
          feedbacksPrestador
        );
      } catch (error) {
        console.error(
          "Erro ao carregar prestador:",
          error
        );

        toast.error(
          "Erro ao carregar prestador!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrestador();
  }, [prestadorId]);

  // ======================================================
  // ALTERAR STATUS DO PRESTADOR
  // ======================================================

  const editarStatusPrestador = async (
    id,
    novoStatus
  ) => {
    const statusString = normalizeStatus(
      novoStatus,
      "INATIVO"
    );

    const toastId = toast.loading(
      "Atualizando status..."
    );

    try {
      // --------------------------------------------------
      // Buscar prestador atualizado
      // --------------------------------------------------

      const prestadorRes = await axios.get(
        `http://localhost:8080/api/v1/prestador/${id}`
      );

      const prestadorData =
        prestadorRes.data;

      // --------------------------------------------------
      // Descobrir usuário vinculado
      // --------------------------------------------------

      const usuarioVinculadoId = Number(
        prestadorData.usuario?.id ??
          prestadorData.usuario_id
      );

      // --------------------------------------------------
      // Atualizar prestador
      // --------------------------------------------------

      await axios.put(
        `http://localhost:8080/api/v1/prestador/${id}`,
        {
          ...prestadorData,

          statusPrestador:
            statusString,
        }
      );

      // --------------------------------------------------
      // Atualizar usuário
      // --------------------------------------------------

      if (
        !Number.isNaN(
          usuarioVinculadoId
        ) &&
        usuarioVinculadoId > 0
      ) {
        if (
          statusString === "ATIVO"
        ) {
          await usuarioService.ativar(
            usuarioVinculadoId
          );
        } else if (
          statusString === "INATIVO"
        ) {
          await usuarioService.inativar(
            usuarioVinculadoId
          );
        }
      }

      // --------------------------------------------------
      // Atualizar tela
      // --------------------------------------------------

      setStatusPrestador(
        statusString
      );

      toast.success(
        `Prestador ${statusString.toLowerCase()} com sucesso!`,
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar prestador/usuário:",
        error
      );

      toast.error(
        "Erro ao atualizar prestador e/ou usuário!",
        {
          id: toastId,
        }
      );
    }
  };

  // ======================================================
  // ALTERAR STATUS DO FEEDBACK
  // ======================================================

  const editarStatusFeedback = async (
    feedback
  ) => {
    const ativando =
      feedback.statusFeedback !==
      "ATIVO";

    const novoStatus = ativando
      ? "ATIVO"
      : "INATIVO";

    const result =
      await Swal.fire({
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
          popup:
            "swal-poppins-popup",

          title:
            "swal-poppins-title",

          htmlContainer:
            "swal-poppins-text",

          confirmButton:
            "swal-poppins-confirm",

          cancelButton:
            "swal-poppins-cancel",
        },
      });

    if (!result.isConfirmed) return;

    const toastId =
      toast.loading(
        "Atualizando status do feedback..."
      );

    try {
      await axios.put(
        `http://localhost:8080/api/v1/feedback/${feedback.id}`,
        {
          statusFeedback:
            novoStatus,
        }
      );

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === feedback.id
            ? {
                ...fb,
                statusFeedback:
                  novoStatus,
              }
            : fb
        )
      );

      toast.success(
        `Feedback ${novoStatus.toLowerCase()} com sucesso!`,
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar status do feedback:",
        error
      );

      toast.error(
        "Erro ao atualizar status do feedback!",
        {
          id: toastId,
        }
      );
    }
  };

  // ======================================================
  // ABRIR DEVVIEW DO USUÁRIO
  // ======================================================

  const abrirDevViewUsuario = async (
    usuarioId
  ) => {
    if (!usuarioId) return;

    try {
      const { data } =
        await usuarioService.buscarPorId(
          usuarioId
        );

      navigate(
        "/dev-view-client",
        {
          state: {
            usuario: data,
          },
        }
      );
    } catch (error) {
      console.error(
        "Erro ao abrir DevView do usuário:",
        error
      );

      toast.error(
        "Não foi possível abrir o DevView do usuário."
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return <Loading />;
  }

  if (!card) {
    return (
      <p>
        Prestador não encontrado.
      </p>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="prestview-page">
      <HeaderSwitcher />

      <div className="prestview-container">

        {/* ==================================================
            FOTO DO PRESTADOR
        ================================================== */}

        {card.foto ? (
          <img
            src={card.foto}
            alt="Prestador"
            className="prestview-photo"
          />
        ) : (
          <div className="prestview-photo-placeholder">
            Foto do prestador não cadastrada
          </div>
        )}

        {/* ==================================================
            NOME
        ================================================== */}

        <div className="prestview-field">
          <label className="prestview-label">
            <IoPersonCircleOutline className="icon" />
            Nome
          </label>

          <input
            type="text"
            className="prestview-input"
            value={card.prestadorNome}
            readOnly
          />
        </div>

        {/* ==================================================
            SERVIÇO
        ================================================== */}

        <div className="prestview-field">
          <label className="prestview-label">
            <FaList className="icon" />
            Serviço
          </label>

          <input
            type="text"
            className="prestview-input"
            value={card.servicoNome}
            readOnly
          />
        </div>

        {/* ==================================================
            DESCRIÇÃO
        ================================================== */}

        <div className="prestview-field">
          <label className="prestview-label">
            <FaList className="icon" />
            Descrição
          </label>

          <textarea
            className="prestview-input"
            value={card.servicoDescricao}
            readOnly
          />
        </div>

        {/* ==================================================
            CONTATOS
        ================================================== */}

        <div className="prestview-field">
          <label className="prestview-label">
            <IoIosCall className="icon" />
            Contatos
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
              card.contatos.map(
                (contato) => (
                  <div
                    className="prestview-contact-row"
                    key={contato.id}
                  >
                    <span className="prestview-contact-type">
                      {contato.tipo}
                    </span>

                    <input
                      type="text"
                      value={contato.link}
                      readOnly
                      className="prestview-input"
                    />
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* ==================================================
            REGIÃO
        ================================================== */}

        <div className="prestview-field">
          <label className="prestview-label">
            <FaMapMarkerAlt className="icon" />
            Região
          </label>

          <input
            type="text"
            value={`${card.cidade} - ${card.uf}`}
            readOnly
            className="prestview-input"
          />
        </div>

        {/* ==================================================
            CATEGORIA
        ================================================== */}

        <div className="prestview-field">
          <label className="prestview-label">
            <FaList className="icon" />
            Categoria
          </label>

          <input
            type="text"
            value={card.categoria}
            readOnly
            className="prestview-input"
          />
        </div>

        {/* ==================================================
            FOTO DO SERVIÇO
        ================================================== */}

        <div className="prestview-field">
          <label className="prestview-label">
            <IoMdImage className="icon" />
            Foto serviço
          </label>

          {card.fotoServico ? (
            <img
              src={card.fotoServico}
              alt="Imagem do serviço"
              className="prestview-image-2"
            />
          ) : (
            <div className="prestview-service-image-placeholder">
              Foto do serviço não cadastrada
            </div>
          )}
        </div>

        {/* ==================================================
            FEEDBACKS
        ================================================== */}

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
                className={`prestview-feedback-card devview-feedback-card ${
                  fb.tipoFeedback ===
                  "FEEDBACK"
                    ? "feedback"
                    : "denuncia"
                } ${
                  fb.statusFeedback ===
                  "INATIVO"
                    ? "inactive"
                    : ""
                }`}
              >

                {/* HEADER DO FEEDBACK */}

                <div className="devview-feedback-header">

                  <div className="devview-feedback-user">

                    <span className="devview-feedback-avatar">
                      {getInicialFeedback(
                        getNomeFeedback(
                          fb,
                          nomesUsuarios
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
                            nomesUsuarios
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

                  {/* STATUS DO FEEDBACK */}

                  <div className="feedback-status-row">

                    <label
                      className="feedback-switch"
                      title={
                        fb.statusFeedback ===
                        "ATIVO"
                          ? "Desativar feedback"
                          : "Ativar feedback"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          fb.statusFeedback ===
                          "ATIVO"
                        }
                        onChange={() =>
                          editarStatusFeedback(
                            fb
                          )
                        }
                      />

                      <span className="feedback-slider"></span>
                    </label>

                  </div>
                </div>

                {/* TÍTULO */}

                <h4>
                  {fb.titulo}
                </h4>

                {/* PRESTADOR DESTINO */}

                <p className="devview-feedback-target">
                  Para:{" "}
                  <Link
                    to={`/dev-view-prestador/${Number(
                      fb.prestadorId
                    )}`}
                  >
                    {
                      prestadoresInfo[
                        Number(
                          fb.prestadorId
                        )
                      ]?.nome ||
                      "Prestador sem nome"
                    }
                  </Link>
                </p>

                {/* DESCRIÇÃO */}

                <p
                  style={{
                    whiteSpace:
                      "pre-line",

                    overflowWrap:
                      "anywhere",
                  }}
                >
                  {breakLineEveryNChars(
                    fb.descricao,
                    70
                  )}
                </p>

                {/* NOTA */}

                <p className="devview-feedback-note">
                  <strong>
                    Nota:
                  </strong>{" "}

                  {getNotaInteira(
                    fb.nota
                  ) > 0
                    ? Array.from(
                        {
                          length:
                            getNotaInteira(
                              fb.nota
                            ),
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
                      )}
                </p>

              </div>
            ))
          )}
        </div>

        {/* ==================================================
            BOTÕES DO PRESTADOR
        ================================================== */}

        {prestador && (
          <div className="prestview-buttons">

            {statusPrestador ===
            "EM_ANALISE" ? (
              <>
                <button
                  className="btn-delete"
                  onClick={() =>
                    editarStatusPrestador(
                      prestador.id,
                      "INATIVO"
                    )
                  }
                >
                  Recusar conta
                </button>

                <button
                  className="btn-edit"
                  onClick={() =>
                    editarStatusPrestador(
                      prestador.id,
                      "ATIVO"
                    )
                  }
                >
                  Aprovar conta
                </button>
              </>
            ) : (
              <button
                className={
                  statusPrestador ===
                  "ATIVO"
                    ? "btn-edit"
                    : "btn-delete"
                }
                onClick={() =>
                  editarStatusPrestador(
                    prestador.id,
                    statusPrestador ===
                      "ATIVO"
                      ? "INATIVO"
                      : "ATIVO"
                  )
                }
              >
                {statusPrestador ===
                "ATIVO"
                  ? "Inativar conta"
                  : "Ativar conta"}
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default DevViewPrestador;