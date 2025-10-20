import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './Cards.css'

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

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
          const prestador = prestadores[0] || {};
          const categoria = categorias[0] || {};
          const regiao = regioes[0] || {};
          const contato = contatos[0] || {};
          const feedback = feedbacks[0] || {};

          return {
            servicoNome: servico.nome,
            servicoDescricao: servico.descricao || "Descrição não disponível",
            categoria: categoria.nome || "Categoria não disponível",
            cidade: prestador.cidade || regiao.cidade || "Cidade não disponível",
            uf: prestador.uf || regiao.uf || "UF não disponível",
            prestadorNome: prestador.nome || "Prestador não disponível",
            contatoMidia: contato.link || null,
            feedbackTitulo: feedback.titulo || null,
            feedbackDescricao: feedback.descricao || null
          };
        });

        setCards(cardsArray);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados dos cards:", error);
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return (
      <div className="cards-container">
        {[...Array(1)].map((_, index) => (
          <div className="card-skeleton" key={index}>
            <div className="skeleton title"></div>
            <div className="skeleton subtitle"></div>
            <div className="skeleton text"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="cards-container">
      {cards.length === 0 ? (
        <p>Nenhum card para mostrar</p>
      ) : (
        cards.map((card, index) => (
          <Link to={"/profile"} state={{ perfil: card }} key={index}>
            <div className="cards">
              <h2>{card.servicoNome}</h2>
              <p className="cards-items">
                <MdStars className='edit-icon'/> {card.categoria}
                <FaSearchLocation  className='edit-icon-2'/> {card.cidade}/{card.uf}
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
