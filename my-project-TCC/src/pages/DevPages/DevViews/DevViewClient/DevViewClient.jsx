import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderSwitcher from '../../../../Components/HeaderSwitcher';
import './DevViewClient.css';

const DevViewClient = () => {
  const location = useLocation();
  const { usuario } = location.state || {};

  if (!usuario) {
    return <div>Nenhum usuário encontrado.</div>;
  }

  return (
    <div className="devclient-page">
      <HeaderSwitcher />
      <div className="devclient-container">
        <h1>INFORMAÇÕES DO CLIENTE</h1>
        <h3>Apenas administradores podem visualizar estas informações.</h3>

        <p className="devclient-label">NOME</p>
        <input
          className="devclient-input"
          type="text"
          value={usuario.nome}
          disabled
        />

        <p className="devclient-label">EMAIL</p>
        <input
          className="devclient-input"
          type="email"
          value={usuario.email}
          disabled
        />

        <button
          className={`devclient-status-btn ${
            usuario.statusUsuario ? 'ativo' : 'inativo'
          }`}
        >
          {usuario.statusUsuario ? 'Conta Ativa' : 'Conta Inativa'}
        </button>
      </div>
    </div>
  );
};

export default DevViewClient;
