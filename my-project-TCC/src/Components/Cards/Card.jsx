import React from 'react';
import './Card.css';
import { MdStars } from "react-icons/md";

const Card = ({ data }) => {
  if (!data) return null;

  return (
    <div className="card">
      <h2 className='card-p'>{data.name}</h2>
      <p id='icon' className='card-p'><MdStars className='edit-icon'/>{data.categoria}</p>
      <p className='card-p'>Descrição {data.description}</p>
    </div>
  );
};

export default Card;
