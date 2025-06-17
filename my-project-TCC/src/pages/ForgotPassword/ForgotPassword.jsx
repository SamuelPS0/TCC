// Importa React e o hook useState do React
import { React, useState } from 'react';
import './ForgotPassword.css';
import Login from '../../Components/Login/Login';


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

      {/* Container para as perguntas de segurança */}
      <div className='fp-second-container'>
        {/* Título das perguntas de segurança */}
        <h1 className='fp-h1'>PERGUNTAS DE <span>SEGURANÇA</span></h1>

        {/* Primeira pergunta */}
        <h3 className='fp-h3'>QUAL NOME COMPLETO DA SUA MÃE?*</h3>
        <input
          id='margin-input'
          className='fp-input'
          type="text"
          value={valorA} // Valor ligado ao estado valorA
          onChange={(e) => setValorA(e.target.value)} // Atualiza estado ao digitar
          placeholder="ESCREVA SUA RESPOSTA"
        />

        {/* Segunda pergunta */}
        <h3 className='fp-h3'>
          <span>QUAL NOME DO SEU MELHOR AMIGO(A) DE INFÂNCIA?*</span>
        </h3>
        <input
          className='fp-input'
          type="text"
          value={valorB} // Valor ligado ao estado valorB
          onChange={(e) => setValorB(e.target.value)} // Atualiza estado ao digitar
          placeholder="ESCREVA SUA RESPOSTA"
        />
      </div>
    </div>
  );
}
