import React, { useState } from 'react';
import '../AccountSecurity/AccountSecurity.css'

export default function AccountSecurity({ onChange }) {
  const [valorA, setValorA] = useState('');
  const [valorB, setValorB] = useState('');

  const handleChangeA = (value) => {
    setValorA(value);
    onChange({ ps_01: value, ps_02: valorB });
  };

  const handleChangeB = (value) => {
    setValorB(value);
    onChange({ ps_01: valorA, ps_02: value });
  };

  return (
    <div className='accountsecurity-second-container'>
      <h1 className='accountsecurity-h1'>PERGUNTAS DE <span>SEGURANÇA</span></h1>

      <h3 className='accountsecurity-h3'>QUAL NOME COMPLETO DA SUA MÃE?*</h3>
      <input
        className='accountsecurity-input'
        type="text"
        value={valorA}
        onChange={(e) => handleChangeA(e.target.value)}
      />

      <h3 className='accountsecurity-h3'>
        <span>QUAL NOME DO SEU MELHOR AMIGO(A) DE INFÂNCIA?*</span>
      </h3>
      <input
        className='accountsecurity-input'
        type="text"
        value={valorB}
        onChange={(e) => handleChangeB(e.target.value)}
      />
    </div>
  );
}
