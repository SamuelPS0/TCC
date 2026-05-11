import React, { useState } from 'react';
import '../AccountSecurity/AccountSecurity.css'

const securityErrorPlaceholder = '\u00A0';
const normalizeSecurityAnswer = (value = '') => String(value ?? '').toLowerCase().replace(/\s/g, '');

export default function AccountSecurity({ onChange, errors = {} }) {
  const [valorA, setValorA] = useState('');
  const [valorB, setValorB] = useState('');

  const handleChangeA = (value) => {
    setValorA(value);
    onChange({ ps_01: normalizeSecurityAnswer(value), ps_02: normalizeSecurityAnswer(valorB) });
  };

  const handleChangeB = (value) => {
    setValorB(value);
    onChange({ ps_01: normalizeSecurityAnswer(valorA), ps_02: normalizeSecurityAnswer(value) });
  };

  return (
    <div className='accountsecurity-second-container'>
      <h1 className='accountsecurity-h1'>PERGUNTAS DE <span>SEGURANÇA</span></h1>

      <h3 className='accountsecurity-h3'>QUAL NOME COMPLETO DA SUA MÃE?*</h3>
      <input
        className='accountsecurity-input'
        type="text"
        placeholder="ESCREVA SUA RESPOSTA"
        value={valorA}
        onChange={(e) => handleChangeA(e.target.value)}
      />
      <p className={`accountsecurity-error ${!errors.ps_01 ? 'accountsecurity-error-hidden' : ''}`}>{errors.ps_01 || securityErrorPlaceholder}</p>

      <h3 className='accountsecurity-h3'>
        <span>QUAL NOME DO SEU MELHOR AMIGO(A) DE INFÂNCIA?*</span>
      </h3>
      <input
        className='accountsecurity-input'
        type="text"
        placeholder="ESCREVA SUA RESPOSTA"
        value={valorB}
        onChange={(e) => handleChangeB(e.target.value)}
      />
      <p className={`accountsecurity-error ${!errors.ps_02 ? 'accountsecurity-error-hidden' : ''}`}>{errors.ps_02 || securityErrorPlaceholder}</p>
    </div>
  );
}