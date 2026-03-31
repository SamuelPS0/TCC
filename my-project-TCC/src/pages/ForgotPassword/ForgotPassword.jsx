import React, { useState } from 'react';
import './ForgotPassword.css';
import axios from 'axios';
import { toast } from 'sonner';
import AccountSecurity from '../../Components/AccountSecurity/AccountSecurity';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [securityData, setSecurityData] = useState({
    ps_01: '',
    ps_02: ''
  });

  const [novaSenha, setNovaSenha] = useState('');

  const handleReset = async () => {
    if (!email || !securityData.ps_01 || !securityData.ps_02 || !novaSenha) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      // 🔎 1. Buscar usuário
      const response = await axios.get(
  'http://localhost:8080/api/v1/Usuario'
);

const user = response.data.find(
  (u) => u.email === email
);


      if (!user) {
        toast.error('Usuário não encontrado');
        return;
      }

      // 🔐 2. Validar respostas
      const respostasValidas =
        user.ps_01.trim().toLowerCase() === securityData.ps_01.trim().toLowerCase() &&
        user.ps_02.trim().toLowerCase() === securityData.ps_02.trim().toLowerCase();

      if (!respostasValidas) {
        toast.error('Respostas incorretas');
        return;
      }

      // 🔄 3. Atualizar senha
      const updatedUser = {
        ...user,
        senha: novaSenha
      };

      await axios.put(
        `http://localhost:8080/api/v1/Usuario/${user.id}`,
        updatedUser
      );

      toast.success('Senha alterada com sucesso!');

    } catch (error) {
      console.error(error);
      toast.error('Erro ao processar solicitação');
    }
  };

  return (
    <div className="container-forgotpassword">

      <div className='forgotpassword-login-edit'>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <AccountSecurity onChange={setSecurityData} />

      <input
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
      />

      <button onClick={handleReset}>
        Trocar senha
      </button>

    </div>
  );
}