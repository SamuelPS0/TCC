import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TfiFaceSad } from "react-icons/tfi";
import "./Cards.css";

const API_BASE_URL = "http://localhost:8080/api/v1";
const DESCRIPTION_LIMIT = 88;

const SkeletonCard = () => (
  <div className="card-skeleton">
    <div className="skeleton skeleton-image"></div>
    <div className="skeleton title"></div>
    <div className="skeleton subtitle"></div>
    <div className="skeleton text"></div>
  </div>
);

const truncateDescription = (description = "") => {
  if (description.length <= DESCRIPTION_LIMIT) return description;

  return `${description.slice(0, DESCRIPTION_LIMIT)}...`;
};

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

const normalizeText = (value = "") => value.toString().trim().toLowerCase();

const formatRating = (rating) => {
  if (rating === null || rating === undefined) return "Sem avaliações";

  return rating.toFixed(1).replace(".", ",");
};

const normalizeStatus = (value, fallback = "") =>
  String(value ?? fallback).trim().toUpperCase();

const getPrestadorStatus = (prestador = {}) =>
  normalizeStatus(
    prestador?.statusPrestador ?? prestador?.status_prestador ?? prestador?.status,
    "INATIVO"
  );

const isPrestadorAtivo = (prestador = {}) => getPrestadorStatus(prestador) === "ATIVO";

const getServicoCounter = (servico = {}) =>
  Number(
    servico.contador ??
      servico.contadorCliques ??
      servico.quantidadeCliques ??
      servico.totalCliques ??
      0
  ) || 0;

const Cards = ({ filter = {} }) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingCounterId, setUpdatingCounterId] = useState(null);

  const { category = "", city = "", minRating = "" } = filter;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const [servicosRes, contatosRes, feedbacksRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/servico`),
          axios.get(`${API_BASE_URL}/contato`),
          axios.get(`${API_BASE_URL}/feedback`),
        ]);

        const servicos = servicosRes.data || [];
        const contatos = contatosRes.data || [];
        const feedbacks = feedbacksRes.data || [];

        const contatosByPrestadorId = Object.fromEntries(
          contatos.map((contato) => [
            Number(contato.prestadorId ?? contato.prestador?.id),
            contato,
          ])
        );

        const feedbacksAtivos = feedbacks.filter(
          (feedback) =>
            feedback?.tipoFeedback === "FEEDBACK" &&
            feedback?.statusFeedback === "ATIVO"
        );

        const notasByPrestadorId = feedbacksAtivos.reduce((acc, feedback) => {
          const prestadorId = Number(feedback.prestadorId ?? feedback.prestador?.id);
          const nota = Number(feedback.nota);

          if (!prestadorId || Number.isNaN(nota)) {
            return acc;
          }

          if (!acc[prestadorId]) {
            acc[prestadorId] = [];
          }

          acc[prestadorId].push(nota);

          return acc;
        }, {});

        const cardsArray = servicos
          .filter((servico) => isPrestadorAtivo(servico?.prestador))
          .map((servico) => {
            const prestador = servico.prestador || {};
            const usuario = prestador.usuario || {};
            const categoriaObj = servico.categoria || {};
            const prestadorId = Number(prestador.id);
            const contato = contatosByPrestadorId[prestadorId] || {};
            const notas = notasByPrestadorId[prestadorId] || [];

            const avaliacaoMedia =
              notas.length > 0
                ? notas.reduce((total, nota) => total + nota, 0) / notas.length
                : null;

            return {
              servicoId: servico.id || null,
              servicoOriginal: servico,
              prestadorId: prestador.id || null,
              servicoNome: servico.nome || "Serviço não disponível",
              servicoDescricao: servico.descricao || "Descrição não disponível",
              categoria: categoriaObj.nome || "Categoria não disponível",
              cidade: prestador.cidade || "Cidade não disponível",
              uf: prestador.uf || "UF não disponível",
              prestadorNome:
                prestador.nome || usuario.nome || "Prestador não disponível",
              contatoMidia: contato.link || null,
              imagemPerfil:
                getImageField(prestador, ["foto"]) ||
                getImageField(usuario, ["foto"]) ||
                null,
              imagemServico:
                getImageField(servico, [
                  "fotoServico",
                  "imagemServico",
                  "foto",
                  "imagem",
                ]) || null,
              avaliacaoMedia,
              totalAvaliacoes: notas.length,
              statusPrestador: getPrestadorStatus(prestador),
              contador: getServicoCounter(servico),
            };
          });

        setCards(cardsArray);
      } catch (error) {
        console.error("Erro ao buscar dados dos cards:", error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const filteredCards = useMemo(() => {
    const [cityName, cityUF] = city ? city.split(" - ") : [null, null];
    const parsedMinRating = minRating ? Number(minRating) : null;

    return cards.filter((card) => {
      const matchCategory = category
        ? normalizeText(card.categoria).includes(normalizeText(category))
        : true;

      const matchCity = cityName
        ? normalizeText(card.cidade).includes(normalizeText(cityName))
        : true;

      const matchUF = cityUF ? normalizeText(card.uf) === normalizeText(cityUF) : true;

      const matchRating =
        parsedMinRating !== null
          ? card.avaliacaoMedia !== null && card.avaliacaoMedia > parsedMinRating
          : true;

      return matchCategory && matchCity && matchUF && matchRating;
    });
  }, [cards, category, city, minRating]);

  const abrirPerfilComContador = async (card) => {
    if (!card?.servicoId) {
      console.warn("[Cards] Serviço sem id. Abrindo perfil sem atualizar contador.", card);
      navigate("/profile", { state: { perfil: card } });
      return;
    }

    const contadorAtual = Number(card.contador ?? 0) || 0;
    const proximoContador = contadorAtual + 1;
    const payload = {
      ...card.servicoOriginal,
      contador: proximoContador,
      contadorCliques: proximoContador,
    };

    setUpdatingCounterId(card.servicoId);
    setCards((prevCards) =>
      prevCards.map((item) =>
        item.servicoId === card.servicoId ? { ...item, contador: proximoContador } : item
      )
    );

    console.debug("[Cards] Payload enviado para contador do serviço:", {
      endpoint: `${API_BASE_URL}/servico/${card.servicoId}`,
      payload,
    });

    try {
      const response = await axios.put(`${API_BASE_URL}/servico/${card.servicoId}`, payload);

      console.debug("[Cards] Resposta da API ao atualizar contador:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });

      setCards((prevCards) =>
        prevCards.map((item) =>
          item.servicoId === card.servicoId
            ? {
                ...item,
                contador: getServicoCounter(response.data || payload) || proximoContador,
                servicoOriginal: response.data || payload,
              }
            : item
        )
      );
    } catch (error) {
      console.error("[Cards] Erro ao atualizar contador do serviço:", {
        payload,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        stack: error.stack,
        error,
      });

      setCards((prevCards) =>
        prevCards.map((item) =>
          item.servicoId === card.servicoId ? { ...item, contador: contadorAtual } : item
        )
      );
    } finally {
      setUpdatingCounterId(null);
      navigate("/profile", { state: { perfil: { ...card, contador: proximoContador } } });
    }
  };

  return (
    <div className="cards-container">
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : filteredCards.length === 0 ? (
        <div className="cards-error">
          <TfiFaceSad className="cards-icon-error" />
          <h1>Nenhum prestador encontrado.</h1>
          <p>
            Não encontramos prestadores com os filtros selecionados. Tente mudar
            a categoria, a cidade ou a avaliação mínima.
          </p>
        </div>
      ) : (
        filteredCards.map((card) => (
          <button
            type="button"
            key={`${card.prestadorId}-${card.servicoId}-${card.servicoNome}`}
            className="cards-link"
            onClick={() => abrirPerfilComContador(card)}
          >
            <article
              className={`cards ${
                updatingCounterId === card.servicoId ? "cards--updating" : ""
              }`}
            >
              <div className="cards-image-wrapper">
                {card.imagemServico ? (
                  <img
                    src={card.imagemServico}
                    alt={card.servicoNome}
                    className="cards-image"
                  />
                ) : (
                  <div className="cards-image cards-image--empty">Sem imagem</div>
                )}

                <span className="cards-rating">
                  <MdStars className="cards-rating__icon" />
                  {formatRating(card.avaliacaoMedia)}

                  {card.totalAvaliacoes > 0 && <small>({card.totalAvaliacoes})</small>}
                </span>

                <span className="cards-counter">
                  {card.contador} clique{card.contador === 1 ? "" : "s"}
                </span>
              </div>

              <div className="cards-content">
                <h2>{card.servicoNome}</h2>

                <div className="cards-items">
                  <span className="cards-item">
                    <MdStars className="edit-icon" />
                    {card.categoria}
                  </span>

                  <span className="cards-item">
                    <FaSearchLocation className="edit-icon-2" />
                    {card.cidade} - {card.uf}
                  </span>
                </div>

                <p className="cards-description">
                  {truncateDescription(card.servicoDescricao)}
                </p>
              </div>
            </article>
          </button>
        ))
      )}
    </div>
  );
};

export default Cards;
