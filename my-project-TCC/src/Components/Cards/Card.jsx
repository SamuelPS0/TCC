import React from 'react';
import './Card.css';
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Card = ({ data }) => {
  if (!data) return null;

  return (
    <div className="card">
      {/* Passa o perfil como state */}
      <Link to={"/profile"} state={{ perfil: data }}>
        <h2 className='card-p'>{data.name}</h2>

        <p id='icon' className='card-p'>
          <MdStars className='edit-icon'/> 
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
