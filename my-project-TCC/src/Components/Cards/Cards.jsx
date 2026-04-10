import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { TfiFaceSad } from "react-icons/tfi";
import './Cards.css';

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
      console.warn("[Cards] Campo de imagem inválido recebido do backend:", trimmed);
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
    console.debug("[Cards] Convertendo base64 puro para data URI.");
    return `data:image/jpeg;base64,${trimmed}`;
  };

  const getImageField = (obj = {}, possibleKeys = []) => {
    for (const key of possibleKeys) {
      const parsed = normalizeImageSrc(obj?.[key]);
      if (parsed) {
        console.debug(`[Cards] Imagem encontrada em '${key}'.`);
        return parsed;
      }
    }
    return null;
  };


  useEffect(() => {
    const fetchCards = async () => {
      try {
        const [
          servicosRes,
          prestadoresRes,
          categoriasRes,
          regioesRes,
          contatosRes,
          feedbacksRes,
          usuariosRes
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/servico"),
          axios.get("http://localhost:8080/api/v1/prestador"),
          axios.get("http://localhost:8080/api/v1/categoria"),
          axios.get("http://localhost:8080/api/v1/regiao"),
          axios.get("http://localhost:8080/api/v1/contato"),
          axios.get("http://localhost:8080/api/v1/feedback"),
          axios.get("http://localhost:8080/api/v1/Usuario"),
        ]);

        const servicos = servicosRes.data;
        const prestadores = prestadoresRes.data;
        const categorias = categoriasRes.data;
        const regioes = regioesRes.data;
        const contatos = contatosRes.data;
        const feedbacks = feedbacksRes.data;
        const usuarios = usuariosRes.data;

        const usuariosById = Object.fromEntries(
          usuarios.map((usuario) => [Number(usuario.id), usuario])
        );

        const cardsArray = servicos.map((servico, index) => {
          const prestador = prestadores[index] || {};
          const categoriaItem = categorias[index] || {};
          const regiao = regioes[index] || {};
          const contato = contatos[index] || {};
          const feedback = feedbacks[index] || {};
          const usuarioId = Number(
            prestador.usuario_id ?? prestador.usuarioId ?? prestador.usuario?.id
          );
          const usuario = usuariosById[usuarioId] || {};
          console.debug("[Cards] Montando card para prestador:", {
            prestadorId: prestador.id,
            usuarioId,
            servicoId: servico.id,
          });

          return {
            prestadorId: prestador.id,
            servicoNome: servico.nome,
            servicoDescricao: servico.descricao || "Descrição não disponível",
            categoria: categoriaItem.nome || "Categoria não disponível",
            cidade: prestador.cidade || regiao.cidade || "Cidade não disponível",
            uf: prestador.uf || regiao.uf || "UF não disponível",
            prestadorNome: prestador.nome || "Prestador não disponível",
            contatoMidia: contato.link || null,
            imagemPerfil:
              getImageField(usuario, ["foto", "imagem", "avatar", "fotoPerfil", "imagemPerfil"]) ||
              getImageField(prestador, ["fotoPerfil", "imagemPerfil", "foto", "imagem", "avatar"]) ||
              getImageField(servico, ["fotoPerfil", "imagemPerfil", "fotoPrestador"]),
            imagemServico: getImageField(servico, ["fotoServico", "imagemServico", "foto", "imagem"]),
            
            feedbackTitulo: feedback.titulo || null,
            feedbackDescricao: feedback.descricao || null
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

  // Divide o valor de city em cidade e UF
  const [cityName, cityUF] = city ? city.split(' - ') : [null, null];

  // Aplica filtro
  const filteredCards = cards.filter(card => {
    const matchCategory = category
      ? card.categoria.toLowerCase().includes(category.toLowerCase())
      : true;

    const matchCity = cityName
      ? card.cidade.toLowerCase().includes(cityName.toLowerCase())
      : true;

    const matchUF = cityUF
      ? card.uf.toLowerCase() === cityUF.toLowerCase()
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
          <TfiFaceSad className="cards-icon-error"/>
        <h1>Erro ao carregar os cards.</h1>
        <p>Ops! Pode ter ocorrido uma falha na conexão ou um problema temporário no servidor. Se o erro persistir, volte em alguns minutos.</p>
        </div>
      ) : (
        filteredCards.map((card, index) => (
          <Link to={"/profile"} state={{ perfil: card }} key={index}>
            <div className="cards">
              <h2>{card.servicoNome}</h2>
              <p className="cards-items">
                <MdStars className='edit-icon'/> {card.categoria}
                <FaSearchLocation className='edit-icon-2'/> {card.cidade} - {card.uf}
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
