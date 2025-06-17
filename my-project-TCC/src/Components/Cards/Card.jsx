import React from 'react';
import './Card.css';
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Card = ({ data }) => {
  // Verifica se a propriedade 'data' foi passada.
  // Se não tiver dados, retorna null para não renderizar nada.
  if (!data) return null;

  return (
    <div className="card">
      <Link to={"/profile"}>
        {/* Exibe o nome do item, selecionado na prop */}
        <h2 className='card-p'>{data.name}</h2>

        {/* Parágrafo que contém os ícones e informações de categoria e local */}
        <p id='icon' className='card-p'>
          <MdStars className='edit-icon'/> 

          {/* Exibe o nome da categoria que vem do objeto 'data' */}
          {data.categoria}
          <FaSearchLocation  className='edit-icon-2'/>
          <p id='card-p-2' className='card-p'>{data.local}</p>

        </p>
        <p className='card-p'>{data.description}</p>

      </Link>
    </div>
  );
};


export default Card;
