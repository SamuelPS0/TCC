import React, { useEffect, useMemo, useState } from 'react';
import './ForgotPassword.css';
import axios from 'axios';
import { toast } from 'sonner';
import AccountSecurity from '../../Components/AccountSecurity/AccountSecurity';
import Login from '../../Components/Login/Login';

const normalizeSecurityAnswer = (value = '') => value.toLowerCase().replace(/\s/g, '');

const securityErrorMessage = 'As informações digitadas não correspondem aos dados cadastrados em nosso sistema.';

export default function ForgotPassword() {
    const [usuarios, setUsuarios] = useState([]);
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [securityData, setSecurityData] = useState({
    ps_01: '',
    ps_02: '',
  });
    const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoadingUsers(true);

      try {
        const response = await axios.get('http://localhost:8080/api/v1/Usuario');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error.response?.data || error.message);
        toast.error('Erro ao carregar dados de recuperação de senha.');
      } finally {
        setLoadingUsers(false);
      }
    };

      fetchUsuarios();
  }, []);

  const usuarioEncontrado = useMemo(() => {
    const emailNormalizado = loginData.email.toLowerCase().trim();

    if (!emailNormalizado) {
      return null;
    }

      return usuarios.find((usuario) => usuario.email?.toLowerCase().trim() === emailNormalizado) || null;
  }, [loginData.email, usuarios]);

  const validationState = useMemo(() => {
    const ps01Preenchida = securityData.ps_01.length > 0;
    const ps02Preenchida = securityData.ps_02.length > 0;
    const primeiraRespostaCorreta =
      Boolean(usuarioEncontrado) &&
      normalizeSecurityAnswer(securityData.ps_01) === normalizeSecurityAnswer(usuarioEncontrado.ps_01);
    const segundaRespostaCorreta =
      Boolean(usuarioEncontrado) &&
      normalizeSecurityAnswer(securityData.ps_02) === normalizeSecurityAnswer(usuarioEncontrado.ps_02);

    return {
      primeiraRespostaCorreta,
      segundaRespostaCorreta,
      respostasValidas: primeiraRespostaCorreta && segundaRespostaCorreta,
      errors: {
        ps_01: ps01Preenchida && usuarioEncontrado && !primeiraRespostaCorreta ? securityErrorMessage : '',
        ps_02: ps02Preenchida && usuarioEncontrado && !segundaRespostaCorreta ? securityErrorMessage : '',
      },
    };
  }, [securityData, usuarioEncontrado]);

  const handleReset = async ({ email, senha }) => {
    if (!email || !securityData.ps_01 || !securityData.ps_02 || !senha) {
      toast.error('Preencha todos os campos');
      return;
    }

if (!usuarioEncontrado) {
      toast.error('Usuário não encontrado');
      return;
    }
      if (!validationState.respostasValidas) {
      toast.error(securityErrorMessage);
      return;
    }

 setUpdatingPassword(true);

 try {
   
      const updatedUser = {
        ...usuarioEncontrado,
        senha,
      };

      await axios.put(
        `http://localhost:8080/api/v1/Usuario/${usuarioEncontrado.id}}`,
        updatedUser
      );

      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.map((usuario) =>
          usuario.id === usuarioEncontrado.id ? updatedUser : usuario
        )
      );

      toast.success('Senha alterada com sucesso!');

    } catch (error) {
      console.error('Erro ao atualizar senha:', error.response?.data || error.message);
      toast.error('Erro ao processar solicitação');
    } finally {
      setUpdatingPassword(false);
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

      <Login
        buttonText="Trocar senha"
        loadingText="Atualizando..."
        passwordLabel="Nova senha"
        passwordPlaceholder="Digite sua nova senha"
        onDataChange={setLoginData}
        onSubmit={handleReset}
        isSubmitting={updatingPassword}
        passwordDisabled={!validationState.respostasValidas}
        buttonDisabled={loadingUsers || !validationState.respostasValidas}
      />

      <button onClick={handleReset}>
        Trocar senha
      </button>
<AccountSecurity onChange={setSecurityData} errors={validationState.errors} />
    </div>
  );
}