import React, { useState } from 'react';
import '../AccountSecurity/AccountSecurity.css'

export default function AccountSecurity() {
  const [valorA, setValorA] = useState('');
  const [valorB, setValorB] = useState('');

  return (
    <div className='accountsecurity-second-container'>
      <h1 className='accountsecurity-h1'>PERGUNTAS DE <span>SEGURANÇA</span></h1>

      <h3 className='accountsecurity-h3'>QUAL NOME COMPLETO DA SUA MÃE?*</h3>
      <input
        id='accountsecurity-margin-input'
        className='accountsecurity-input'
        type="text"
        value={valorA}
        onChange={(e) => setValorA(e.target.value)}
        placeholder="ESCREVA SUA RESPOSTA"
      />

      <h3 className='accountsecurity-h3'>
        <span>QUAL NOME DO SEU MELHOR AMIGO(A) DE INFÂNCIA?*</span>
      </h3>
      <input
        className='accountsecurity-input'
        type="text"
        value={valorB}
        onChange={(e) => setValorB(e.target.value)}
        placeholder="ESCREVA SUA RESPOSTA"
      />
    </div>
  );
}
