import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const [
          servicosRes,
          prestadoresRes,
          categoriasRes,
          regioesRes,
          contatosRes,
          feedbacksRes
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/servico"),
          axios.get("http://localhost:8080/api/v1/prestador"),
          axios.get("http://localhost:8080/api/v1/categoria"),
          axios.get("http://localhost:8080/api/v1/regiao"),
          axios.get("http://localhost:8080/api/v1/contato"),
          axios.get("http://localhost:8080/api/v1/feedback"),
        ]);

        const servicos = servicosRes.data;
        const prestadores = prestadoresRes.data;
        const categorias = categoriasRes.data;
        const regioes = regioesRes.data;
        const contatos = contatosRes.data;
        const feedbacks = feedbacksRes.data;

        const cardsArray = servicos.map((servico, index) => {
          const prestador = prestadores[index] || {};
          const categoriaItem = categorias[index] || {};
          const regiao = regioes[index] || {};
          const contato = contatos[index] || {};
          const feedback = feedbacks[index] || {};

          return {
            prestadorId: prestador.id,
            servicoNome: servico.nome,
            servicoDescricao: servico.descricao || "Descrição não disponível",
            categoria: categoriaItem.nome || "Categoria não disponível",
            cidade: prestador.cidade || regiao.cidade || "Cidade não disponível",
            uf: prestador.uf || regiao.uf || "UF não disponível",
            prestadorNome: prestador.nome || "Prestador não disponível",
            contatoMidia: contato.link || null,
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
        <p>Nenhum card para mostrar</p>
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
