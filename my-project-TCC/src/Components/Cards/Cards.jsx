import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TfiFaceSad } from "react-icons/tfi";
import "./Cards.css";

const SkeletonCard = () => (
  <div className="card-skeleton">
    <div className="skeleton title"></div>
    <div className="skeleton subtitle"></div>
    <div className="skeleton text"></div>
  </div>
);

const Cards = ({ filter = {} }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category, city } = filter;

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

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const [servicosRes, contatosRes, feedbacksRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/servico"),
          axios.get("http://localhost:8080/api/v1/contato"),
          axios.get("http://localhost:8080/api/v1/feedback"),
        ]);

        const servicos = servicosRes.data || [];
        const contatos = contatosRes.data || [];
        const feedbacks = feedbacksRes.data || [];

        const contatosByPrestadorId = Object.fromEntries(
          contatos.map((c) => [Number(c.prestadorId ?? c.prestador?.id), c])
        );

        const feedbacksAtivos = feedbacks.filter(
          (f) => f?.tipoFeedback === "FEEDBACK" && f?.statusFeedback === "ATIVO"
        );

        const cardsArray = servicos.map((servico) => {
          const prestador = servico.prestador || {};
          const usuario = prestador.usuario || {};
          const categoriaObj = servico.categoria || {};
          const prestadorId = Number(prestador.id);

          const contato = contatosByPrestadorId[prestadorId] || {};

          const feedbackDoPrestador =
            feedbacksAtivos.find(
              (f) => Number(f.prestadorId) === prestadorId
            ) || {};

          return {
            prestadorId: prestador.id || null,
            servicoNome: servico.nome || "Serviço não disponível",
            servicoDescricao: servico.descricao || "Descrição não disponível",
            categoria: categoriaObj.nome || "Categoria não disponível",
            cidade: prestador.cidade || "Cidade não disponível",
            uf: prestador.uf || "UF não disponível",
            prestadorNome: prestador.nome || usuario.nome || "Prestador não disponível",
            contatoMidia: contato.link || null,
            imagemPerfil:
              getImageField(prestador, ["foto"]) ||
              getImageField(usuario, ["foto"]) ||
              null,
            imagemServico:
              getImageField(servico, ["fotoServico", "imagemServico", "foto", "imagem"]) ||
              null,
            feedbackTitulo: feedbackDoPrestador.titulo || null,
            feedbackDescricao: feedbackDoPrestador.descricao || null,
          };
        });

        setCards(cardsArray);
      } catch (error) {
        console.error("Erro ao buscar dados dos cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const [cityName, cityUF] = city ? city.split(" - ") : [null, null];

  const filteredCards = cards.filter((card) => {
    const matchCategory = category
      ? card.categoria.toLowerCase().includes(category.toLowerCase())
      : true;

    const matchCity = cityName
      ? card.cidade.toLowerCase().includes(cityName.toLowerCase())
      : true;

    const matchUF = cityUF
      ? card.uf.toLowerCase().trim() === cityUF.toLowerCase().trim()
      : true;

    return matchCategory && matchCity && matchUF;
  });

  return (
    <div className="cards-container">
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : filteredCards.length === 0 ? (
        <div className="cards-error">
          <TfiFaceSad className="cards-icon-error" />
          <h1>Erro ao carregar os cards.</h1>
          <p>
            Ops! Pode ter ocorrido uma falha na conexão ou um problema temporário
            no servidor. Se o erro persistir, volte em alguns minutos.
          </p>
        </div>
      ) : (
        filteredCards.map((card, index) => (
          <Link to="/profile" state={{ perfil: card }} key={index}>
            <div className="cards">
              <h2>{card.servicoNome}</h2>
              <p className="cards-items">
                <MdStars className="edit-icon" /> {card.categoria}
                <FaSearchLocation className="edit-icon-2" /> {card.cidade} - {card.uf}
              </p>
              <p className="cards-description">{card.servicoDescricao}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default Cards;