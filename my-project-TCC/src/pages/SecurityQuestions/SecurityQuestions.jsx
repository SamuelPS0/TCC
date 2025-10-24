import React from 'react';
import './SecurityQuestions.css';
import { useNavigate } from 'react-router-dom';
import AccountSecurity from '../../Components/AccountSecurity/AccountSecurity';
import {toast} from 'sonner'

const SecurityQuestions = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    toast.success('Usuario criado com sucesso!')
    navigate('/login');
  };

  return (
    <div className='sq-container'>
      <h1 className='sq-h1'>
        ESSAS INFORMAÇÕES AJUDAM A <span>PROTEGER SUA CONTA</span> E PODEM SER USADAS PARA <span>RECUPERAÇÃO</span> DE ACESSO.
      </h1>
      <div className='sq-second-container'>
        <AccountSecurity />
        <button type="button" onClick={handleClick}>FINALIZAR CADASTRO</button>
      </div>
    </div>
  );
};

export default SecurityQuestions;
