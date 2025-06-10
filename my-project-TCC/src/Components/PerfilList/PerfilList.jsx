import React, { useEffect, useState } from 'react';
import Card from '../../Components/Cards/Card';
import './PerfilList.css'
import { useNavigate } from 'react-router-dom';

export default function PerfilList() {
  const [perfis, setPerfis] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("perfis")) || [];
    setPerfis(dados);
  }, []);

  if (perfis.length === 0) {
    return <p className='no-profile'>Nenhum perfil cadastrado.</p>;
  }

  return (
    <div className="cards-container">
      {perfis.map(perfil => (
        <Card
          key={perfil.id}
          data={perfil}
          onEdit={() => navigate('/createperfil', { state: { perfilParaEditar: perfil } })}
          onRemove={() => {
            const novosPerfis = perfis.filter(p => p.id !== perfil.id);
            setPerfis(novosPerfis);
            localStorage.setItem('perfis', JSON.stringify(novosPerfis));
          }}
        />
      ))}
    </div>
  );
}
