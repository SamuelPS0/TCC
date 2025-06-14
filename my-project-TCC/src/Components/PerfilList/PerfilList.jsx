import React, { useEffect, useState } from 'react';
import Card from '../../Components/Cards/Card';
import './PerfilList.css';

export default function PerfilList({ filters }) {
  const [perfis, setPerfis] = useState([]);
  const [filteredPerfis, setFilteredPerfis] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("perfis")) || [];
    setPerfis(dados);
  }, []);

  useEffect(() => {
    if (!filters) {
      setFilteredPerfis(perfis);
      return;
    }

    const { category, location } = filters;

    const filtered = perfis.filter(perfil => {
      const categoryMatch = category ? perfil.categoria === category : true;
      const locationMatch = location
        ? perfil.local.toLowerCase().includes(location.toLowerCase())
        : true;

      return categoryMatch && locationMatch;
    });

    setFilteredPerfis(filtered);
  }, [filters, perfis]);

  const handleClearAll = () => {
    localStorage.removeItem("perfis");
    setPerfis([]);
    setFilteredPerfis([]);
  };

  return (
    <div>
      <button className="clear-all-button" onClick={handleClearAll}>
        Apagar Todos
      </button>

      {filteredPerfis.length === 0 ? (
        <p className='no-profile'>Nenhum perfil encontrado.</p>
      ) : (
        <div className="cards-container">
          {filteredPerfis.map(perfil => (
            <Card
              key={perfil.id || perfil.name}
              data={perfil}
            />
          ))}
        </div>
      )}
    </div>
  );
}
