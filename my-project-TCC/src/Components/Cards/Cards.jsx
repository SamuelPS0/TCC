import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import './Cards.css'

const Cards = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Busca todos os dados do backend
        const [
          servicosRes,
          prestadoresRes,
          categoriasRes,
          regioesRes,
          contatosRes,
          feedbacksRes
        ] = await Promise.all([ //usei promisse all pra ficar mais facil
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

        // Monta os cards usando os primeiros itens disponíveis por enaquanto
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
        console.log("Cards montados:", cardsArray);
      } catch (error) {
        console.error("Erro ao buscar dados dos cards:", error);
      }
    };

    fetchCards();
  }, []);

  return (
    <div>
      {cards.length === 0 ? (
        <p>Nenhum card para mostrar</p>
      ) : (
        cards.map((card, index) => (
          <Link to={"/profile"} state={{ perfil: card } } key={index} >
          <div className="cards">
            <h2>{card.servicoNome}</h2>
            <p>{card.categoria} - {card.cidade}/{card.uf}</p>
            <p>{card.servicoDescricao}</p>
          </div>
      </Link>
        ))
      )}
    </div>
  );
};

export default Cards;
