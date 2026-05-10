import React, { useEffect, useMemo, useState } from 'react';
import './ForgotPassword.css';
import axios from 'axios';
import { toast } from 'sonner';
import AccountSecurity from '../../Components/AccountSecurity/AccountSecurity';
import Login from '../../Components/Login/Login';

const normalizeSecurityAnswer = (value = '') =>
  value.toLowerCase().replace(/\s/g, '');

const securityErrorMessage =
  'As informações digitadas não correspondem aos dados cadastrados em nosso sistema.';

export default function ForgotPassword() {
  const [usuarios, setUsuarios] = useState([]);

  const [loginData, setLoginData] = useState({
    email: '',
    senha: '',
  });

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
        console.log('==== BUSCANDO USUÁRIOS ====');

        const response = await axios.get(
          'http://localhost:8080/api/v1/Usuario'
        );

        console.log('==== DADOS RECEBIDOS DO BACKEND ====');
        console.log(response.data);

        setUsuarios(response.data);
      } catch (error) {
        console.error('==== ERRO AO BUSCAR USUÁRIOS ====');
        console.error(error.response?.data || error.message);

        toast.error('Erro ao carregar dados de recuperação de senha.');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsuarios();
  }, []);

  const usuarioEncontrado = useMemo(() => {
    const emailNormalizado = loginData.email.toLowerCase().trim();

    console.log('==== EMAIL DIGITADO ====');
    console.log(loginData.email);

    console.log('==== EMAIL NORMALIZADO ====');
    console.log(emailNormalizado);

    if (!emailNormalizado) {
      return null;
    }

    const usuario =
      usuarios.find(
        (usuario) =>
          usuario.email?.toLowerCase().trim() === emailNormalizado
      ) || null;

    console.log('==== USUÁRIO ENCONTRADO ====');
    console.log(usuario);

    return usuario;
  }, [loginData.email, usuarios]);

  const validationState = useMemo(() => {
    const ps01Preenchida = securityData.ps_01.length > 0;
    const ps02Preenchida = securityData.ps_02.length > 0;

    const resposta01Normalizada = normalizeSecurityAnswer(
      securityData.ps_01
    );

    const resposta02Normalizada = normalizeSecurityAnswer(
      securityData.ps_02
    );

    const backendResposta01 = normalizeSecurityAnswer(
      usuarioEncontrado?.ps_01 || ''
    );

    const backendResposta02 = normalizeSecurityAnswer(
      usuarioEncontrado?.ps_02 || ''
    );

    console.log('==== RESPOSTAS DIGITADAS ====');
    console.log(securityData);

    console.log('==== RESPOSTAS NORMALIZADAS ====');
    console.log({
      resposta01Normalizada,
      resposta02Normalizada,
    });

    console.log('==== RESPOSTAS DO BACKEND ====');
    console.log({
      backendResposta01,
      backendResposta02,
    });

    const primeiraRespostaCorreta =
      Boolean(usuarioEncontrado) &&
      resposta01Normalizada === backendResposta01;

    const segundaRespostaCorreta =
      Boolean(usuarioEncontrado) &&
      resposta02Normalizada === backendResposta02;

    console.log('==== VALIDAÇÃO DAS SECURITY QUESTIONS ====');
    console.log({
      primeiraRespostaCorreta,
      segundaRespostaCorreta,
    });

    return {
      primeiraRespostaCorreta,
      segundaRespostaCorreta,
      respostasValidas:
        primeiraRespostaCorreta && segundaRespostaCorreta,

      errors: {
        ps_01:
          ps01Preenchida &&
          usuarioEncontrado &&
          !primeiraRespostaCorreta
            ? securityErrorMessage
            : '',

        ps_02:
          ps02Preenchida &&
          usuarioEncontrado &&
          !segundaRespostaCorreta
            ? securityErrorMessage
            : '',
      },
    };
  }, [securityData, usuarioEncontrado]);

  const handleReset = async (data = loginData) => {
    const email = data.email?.trim() || '';
    const senha = data.senha || '';

    console.log('==== INICIANDO RESET DE SENHA ====');

    console.log({
      email,
      senha,
      securityData,
    });

    if (
      !email ||
      !securityData.ps_01 ||
      !securityData.ps_02 ||
      !senha
    ) {
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

      console.log('==== PAYLOAD ENVIADO PARA RESET DE SENHA ====');
      console.log(updatedUser);

      const response = await axios.put(
        `http://localhost:8080/api/v1/Usuario/${usuarioEncontrado.id}`,
        updatedUser
      );

      console.log('==== RESPOSTA DO BACKEND AO ATUALIZAR SENHA ====');
      console.log(response.data);

      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.map((usuario) =>
          usuario.id === usuarioEncontrado.id
            ? updatedUser
            : usuario
        )
      );

      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      console.error('==== ERRO AO ATUALIZAR SENHA ====');
      console.error(error.response?.data || error.message);

      toast.error('Erro ao processar solicitação');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="container-forgotpassword">

      <div className="forgotpassword-login-edit">
      </div>

      <Login
        buttonText="Trocar senha"
        loadingText="Atualizando..."
        passwordLabel="Nova senha"
        passwordPlaceholder="Digite sua nova senha"
        onDataChange={setLoginData}
        onSubmit={handleReset}
        isSubmitting={updatingPassword}
        passwordDisabled={!validationState.respostasValidas}
        buttonDisabled={
          loadingUsers || !validationState.respostasValidas
        }
      />

      <AccountSecurity
        onChange={setSecurityData}
        errors={validationState.errors}
      />
    </div>
  );
}