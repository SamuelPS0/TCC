import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderSwitcher from '../../../../Components/HeaderSwitcher';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from 'sonner';
import axios from 'axios';
import './DevViewClient.css';

const DevViewClient = () => {
  const location = useLocation();
  const { usuario } = location.state || {};


  if (!usuario) {
    return <div>Nenhum usuário encontrado.</div>;
  }

  const [nivel, setNivel] = useState(usuario.nivelAcesso || '');
  const [usuarioStatus, setUsuarioStatus] = useState(usuario.statusUsuario || false);

  useEffect(() => {
    setNivel(usuario.nivelAcesso);
    setUsuarioStatus(usuario.statusUsuario);
    console.log('informações recebidas: ', usuario)
  }, [usuario]);

const editarNivel = async (id, novoNivel) => {
   const toastId = toast.loading('Atualizando nível de acesso...');
  try {
    const response = await axios.put(`http://localhost:8080/api/v1/Usuario/${id}`, {
      nome: usuario.nome,           // manter o nome atual
      email: usuario.email,         // manter email atual
      senha: usuario.senha,         // manter senha atual
      nivelAcesso: novoNivel,       // novo nível

    });
    setNivel(novoNivel);
    console.log('Nível de acesso atualizado com sucesso!', response.data);
    toast.success('Nível de acesso atualizado com sucesso!', { id: toastId});
  } catch (error) {
    toast.warning('Ocorreu um erro... Cheque o console');
    console.error('Erro ao editar nível:', error);
  }
};

const editarStatus = async (id, novoStatus) => {
  const toastId = toast.loading('Atualizando status do usuario..');
  try {
    const response = await axios.put(`http://localhost:8080/api/v1/Usuario/${id}`, {
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      nivelAcesso: nivel,         // nível atual
      statusUsuario: novoStatus   // novo status
    });
    setUsuarioStatus(response.data.statusUsuario);
    toast.success('Status atualizado com sucesso!', { id: toastId });
    console.log('Status atualizado com sucesso!', novoStatus);
    console.log('Situação atual: ', response.data.statusUsuario)
  } catch (error) {
    console.error('Erro ao editar status:', error);
  }
};

const [dropdownOpen, setDropdownOpen] = useState(false);



  return (
    <div className="devclient-page">
      <HeaderSwitcher />
      <div className="devclient-container">
        <h1 className='devclient-h1'>INFORMAÇÕES DO CLIENTE</h1>
        <h3>Apenas administradores podem visualizar estas informações.</h3>

        <p className="devclient-label">NOME</p>
        <input className="devclient-input" type="text" value={usuario.nome} disabled />

        <p className="devclient-label">EMAIL</p>
        <input className="devclient-input" type="email" value={usuario.email} disabled />

        <p className="devclient-label">Nível de acesso</p>


<div className="devclient-dropdown">
  <button
    className="btn"
    onClick={() => setDropdownOpen(!dropdownOpen)}
  >
    {nivel} <MdOutlineKeyboardArrowDown className="devclient-icon" />
  </button>

  {dropdownOpen && (
    <div className="devclient-dropdown-menu">
      {['ADMIN', 'PRESTADOR', 'CLIENTE'].map((option) => (
        <div
          key={option}
          className="devclient-dropdown-item"
          onClick={() => {
            editarNivel(usuario.id, option);
            setDropdownOpen(false); // fecha o dropdown
          }}
        >
          {option}
        </div>
      ))}
    </div>
  )}
</div>

          <button
            className={`devclient-status-btn ${usuarioStatus ? 'ativo' : 'inativo'}`}
            onClick={() => {
              const novoStatus = !usuarioStatus;
              setUsuarioStatus(novoStatus);
              editarStatus(usuario.id, novoStatus); 
            }}
          >
            {usuarioStatus ? 'Conta Ativa' : 'Conta Inativa'}
          </button>

      </div>
    </div>
  );
};

export default DevViewClient;
