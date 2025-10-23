import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './Cards.css';

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      console.log("🔄 Iniciando busca de dados...");

      try {
        const [servicosRes, contatosRes, feedbacksRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/servico"),
          axios.get("http://localhost:8080/api/v1/contato"),
          axios.get("http://localhost:8080/api/v1/feedback"),
        ]);

        const servicos = servicosRes.data;
        const contatos = contatosRes.data;
        const feedbacks = feedbacksRes.data;

        const cardsArray = servicos.map(servico => {
          const prestador = servico.prestador || {};
          const categoria = servico.categoria || {};
          const contato = contatos.find(
            c => Number(c.prestadorId) === Number(prestador.id) && c.statusContato === "ATIVO"
          ) || {};
          const feedbacksPrestador = feedbacks.filter(
            f => Number(f.prestadorId) === Number(prestador.id)
          );

          return {
            servicoNome: servico.nome,
            servicoDescricao: servico.descricao || "Descrição não disponível",
            categoria: categoria.nome || "Categoria não disponível",
            cidade: prestador.cidade || "Cidade não disponível",
            uf: prestador.uf || "UF não disponível",
            prestadorNome: prestador.nome || "Prestador não disponível",
            prestadorId: prestador.id || null,
            contatoMidia: contato.link || null,
            feedbacks: feedbacksPrestador,
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
        <div className="card-skeleton">
          <div className="skeleton title"></div>
          <div className="skeleton subtitle"></div>
          <div className="skeleton text"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cards-container">
      {cards.length === 0 ? (
        <p>Erro em carregar cards</p>
      ) : (
        cards.map((card, index) => (
          <Link to="/profile" state={{ perfil: card }} key={index}>
            <div className="cards">
              <h2>{card.servicoNome}</h2>
              <p className="cards-items">
                <MdStars className='edit-icon' /> {card.categoria}
                <FaSearchLocation className='edit-icon-2' /> {card.cidade} - {card.uf}
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
