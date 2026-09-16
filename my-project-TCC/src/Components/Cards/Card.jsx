import React from 'react';
import './Card.css';
import { MdStars } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const Card = ({ data }) => {
  const navigate = useNavigate();

  if (!data) return null;

  const handleClick = async (e) => {
    if (e) e.preventDefault();

    // 1. Identifica o ID recebido
    const targetId = data.servicoId || data.id;
    console.log('[DEBUG] Tentando incrementar contador para o ID:', targetId);
    console.log('[DEBUG] Objeto data recebido:', data);

    if (!targetId) {
      console.error('[ERRO] Nenhum ID válido encontrado no objeto data!');
      return;
    }

    let perfilAtualizado = { ...data };

    try {
      // 2. Faz a requisição PATCH para o servidor
      const url = `${API_BASE_URL}/servico/${targetId}/contador`;
      console.log('[DEBUG] Enviando requisição PATCH para:', url);

      const response = await axios.patch(url);
      console.log('[DEBUG] Resposta do backend:', response.data);

      if (response.data && response.data.contador !== undefined) {
        perfilAtualizado.contador = response.data.contador;
      } else {
        perfilAtualizado.contador = (data.contador || 0) + 1;
      }
    } catch (error) {
      // 3. Exibe a falha exata da API
      if (error.response) {
        console.error('[ERRO BACKEND] Status:', error.response.status);
        console.error('[ERRO BACKEND] Dados:', error.response.data);
      } else if (error.request) {
        console.error('[ERRO REDE] O servidor não respondeu. Verifique se a API está rodando.');
      } else {
        console.error('[ERRO]', error.message);
      }
      perfilAtualizado.contador = (data.contador || 0) + 1;
    }

    // 4. Navegação para o perfil
    console.log('[DEBUG] Navegando para /profile com:', perfilAtualizado);
    navigate('/profile', { state: { perfil: perfilAtualizado } });
  };

  return (
    <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <h2 className='card-p'>{data.servicoNome || data.name}</h2>

      <div id='icon' className='card-p'>
        <MdStars className='edit-icon' /> 
        {data.categoria}
        <FaSearchLocation className='edit-icon-2' />
        <span id='card-p-2' className='card-p'>
          {data.cidade ? `${data.cidade} - ${data.uf}` : data.local}
        </span>
      </div>

      <p className='card-p'>{data.servicoDescricao || data.description}</p>
    </div>
  );
};

export default Card;