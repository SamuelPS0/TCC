import React, { useEffect, useMemo, useState } from 'react';
import './ForgotPassword.css';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Login from '../../Components/Login/Login';
import { useAuth } from '../../Components/AuthContext';
import accessLevels from '../../Components/accessLevels';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
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

  const usuarioEncontrado = useMemo(() => {
    const emailNormalizado = email.toLowerCase();

    if (!emailNormalizado) {
      return null;
    }

    return usuarios.find((usuario) => usuario.email?.toLowerCase().trim() === emailNormalizado) || null;
  }, [email, usuarios]);

  const handleReset = async (formData = {}) => {
    const emailInformado = (formData.email || email).trim();
    const senhaInformada = formData.senha || novaSenha;

    if (!emailInformado || !senhaInformada) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!usuarioEncontrado) {
      toast.error('Usuário não encontrado');
      return;
    }

    setUpdatingPassword(true);

    try {
      const updatedUser = {
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        senha: senhaInformada,
        nivelAcesso: usuarioEncontrado.nivelAcesso,
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
        buttonDisabled={loadingUsers}
      />
    </div>
  );
}
