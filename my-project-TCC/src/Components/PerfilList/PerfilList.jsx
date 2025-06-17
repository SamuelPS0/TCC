import React, { useEffect, useState } from 'react';
import Card from '../../Components/Cards/Card';
import './PerfilList.css';

export default function PerfilList({ filters }) {


  // Estado para armazenar todos os perfis recuperados do localStorage
  const [perfis, setPerfis] = useState([]);
  // Estado para armazenar os perfis já filtrados de acordo com os filtros aplicados
  const [filteredPerfis, setFilteredPerfis] = useState([]);

  // useEffect para carregar os perfis do localStorage assim que o componente monta/surge
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("perfis")) || [];
    setPerfis(dados); // Atualiza o estado com os dados carregados
  }, []);

  // useEffect que roda sempre que os filtros ou a lista de perfis mudam,
  // responsável por filtrar os perfis com base nos filtros aplicados
  useEffect(() => {
    // Se não houver filtros, mostra todos os perfis
    if (!filters) {
      setFilteredPerfis(perfis);
      return;
    }

    // Desestrutura os filtros category e location
    const { category, location } = filters;

    // Filtra a lista de perfis:
    const filtered = perfis.filter(perfil => {
      // Verifica se o perfil corresponde à categoria (se filtro category estiver definido)
      const categoryMatch = category ? perfil.categoria === category : true;
      // Verifica se o perfil corresponde à localização (filtro location contém a string)
      const locationMatch = location
      //toLowerCase para garantir que não haja falhas (garantia)
        ? perfil.local.toLowerCase().includes(location.toLowerCase())
        : true;

      // Retorna true somente se ambos os critérios forem atendidos
      return categoryMatch && locationMatch;
    });

    // Atualiza o estado com os perfis filtrados
    setFilteredPerfis(filtered);
  }, [filters, perfis]);

  // Função para limpar todos os perfis: remove do localStorage e limpa estados
  // Fins apenas para teste (DEV), vai sair no produto final
  const handleClearAll = () => {
    localStorage.removeItem("perfis");
    setPerfis([]);
    setFilteredPerfis([]);
  };

  return (
    <div>
      {/* Botão para apagar todos os perfis */}
      {/* Fins apenas para teste (DEV), vai sair no produto final*/}
      <button className="clear-all-button" onClick={handleClearAll}>
        Apagar Todos
      </button>

      {/* Se não houver perfis filtrados, exibe mensagem */}
      {filteredPerfis.length === 0 ? (
        <p className='no-profile'>Nenhum perfil encontrado.</p>
      ) : (
        // Caso contrário, exibe os perfis filtrados dentro do container
        <div className="cards-container">
          {filteredPerfis.map(perfil => (
            // Renderiza o componente Card para cada perfil
            <Card
              key={perfil.id || perfil.name} // Usa id ou name como key única
              data={perfil} // Passa os dados do perfil para o Card
            />
          ))}
        </div>
      )}
    </div>
  );
}
