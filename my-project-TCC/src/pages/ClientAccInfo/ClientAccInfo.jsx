import React, { useState } from 'react';
import SideMenuCLIENT from '../../Components/SideMenu/SideMenuCLIENT/SideMenuCLIENT';
import './ClientAccInfo.css';

function ClientAccInfo() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className='clientinfo-page'>
      <div className='clientinfo-container'>
        <h1>INFORMAÇÕES DA CONTA</h1>
        <h3>Apenas você tem acesso a estas<br/> informações pessoais.</h3>
      <div className='clientinfo-content'>
      <SideMenuCLIENT />
      <div className='clientinfo-inputs-container'>
        <p className='clientinfo-label'>NOME</p>  
        <input
          className='clientinfo-input'
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
        />

        <p className='clientinfo-label'>EMAIL</p>
        <input
          className='clientinfo-input'
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
        />

        <p className='clientinfo-label'>SENHA</p>
        <input
          className='clientinfo-input'
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
        />
         </div>
        </div>
      </div>
    </div>
  );
}

export default ClientAccInfo;
