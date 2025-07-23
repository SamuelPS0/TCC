// Importa React e o hook useState do React
import { React, useState } from 'react';
import './ForgotPassword.css';
import Login from '../../Components/Login/Login';
import AccountSecurity from '../../Components/AccountSecurity/AccountSecurity'


export default function ForgotPassword() {
  // Cria estado para armazenar a resposta da primeira pergunta de segurança
  const [valorA, setValorA] = useState('');
  // Cria estado para armazenar a resposta da segunda pergunta de segurança
  const [valorB, setValorB] = useState('');

  return (
    <div className="container-forgotpassword">
      {/* Container para o componente de login */}
      <div className='forgotpassword-login-edit'>
        {/* Usa o componente Login com texto customizado no botão */}
        <Login buttonText="Trocar senha" />
      </div>

        <AccountSecurity />
      </div>
  );
}
