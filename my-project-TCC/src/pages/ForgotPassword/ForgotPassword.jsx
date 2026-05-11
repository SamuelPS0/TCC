import React, { useEffect, useMemo, useState } from 'react';
import './ForgotPassword.css';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import AccountSecurity from '../../Components/AccountSecurity/AccountSecurity';
import Login from '../../Components/Login/Login';
import { useAuth } from '../../Components/AuthContext';
import accessLevels from '../../Components/accessLevels';

const normalizeSecurityAnswer = (value = '') => String(value ?? '').toLowerCase().replace(/\s/g, '');

const securityErrorMessage = 'As informações digitadas não correspondem aos dados cadastrados em nosso sistema.';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { login } = useAuth();
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

  const email = loginData.email.trim();
  const novaSenha = loginData.senha;
  const emailPreenchido = email.length > 0;

  const usuarioEncontrado = useMemo(() => {
    const emailNormalizado = email.toLowerCase();

    if (!emailNormalizado) {
      return null;
    }

    return usuarios.find((usuario) => usuario.email?.toLowerCase().trim() === emailNormalizado) || null;
  }, [email, usuarios]);

  const validationState = useMemo(() => {
    const ps01Preenchida = securityData.ps_01.length > 0;
    const ps02Preenchida = securityData.ps_02.length > 0;
    const podeValidarRespostas = emailPreenchido && !loadingUsers;
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
        ps_01: ps01Preenchida && podeValidarRespostas && !primeiraRespostaCorreta ? securityErrorMessage : '',
        ps_02: ps02Preenchida && podeValidarRespostas && !segundaRespostaCorreta ? securityErrorMessage : '',
      },
    };
  }, [emailPreenchido, loadingUsers, securityData, usuarioEncontrado]);

  const handleReset = async (formData = {}) => {
    const emailInformado = (formData.email || email).trim();
    const senhaInformada = formData.senha || novaSenha;

    if (!emailInformado || !securityData.ps_01 || !securityData.ps_02 || !senhaInformada) {
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
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        senha: senhaInformada,
        nivelAcesso: usuarioEncontrado.nivelAcesso,
        ps_01: usuarioEncontrado.ps_01,
        ps_02: usuarioEncontrado.ps_02,
        dataCadastro: usuarioEncontrado.dataCadastro,
        statusUsuario: usuarioEncontrado.statusUsuario,
      };

      await axios.put(
        `http://localhost:8080/api/v1/Usuario/${usuarioEncontrado.id}`,
        updatedUser
      );

      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.map((usuario) =>
          usuario.id === usuarioEncontrado.id ? { ...updatedUser, id: usuarioEncontrado.id } : usuario
        )
      );

      const level = usuarioEncontrado.nivelAcesso || accessLevels.CLIENTE;

      login({
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
        accessLevel: level,
      });
      localStorage.setItem('userLevel', level);

      toast.success('Senha alterada com sucesso!');
      navigate('/home-list');
    } catch (error) {
      console.error('Erro ao atualizar senha:', error.response?.data || error.message);
      toast.error('Erro ao processar solicitação');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="container-forgotpassword">
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

      <AccountSecurity onChange={setSecurityData} errors={validationState.errors} />
    </div>
  );
}