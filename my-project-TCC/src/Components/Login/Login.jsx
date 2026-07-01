import React, { useEffect, useState } from 'react'; import axios from 'axios';
import LogoLogin from '../../img/DivulgAÍ-removebg-preview.png';
import './Login.css';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaRegEnvelope } from 'react-icons/fa';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6';

import { useAuth } from '../../Components/AuthContext';
import accessLevels from '../../Components/accessLevels';

export default function Login({
  buttonText = 'Entrar',
  loadingText = 'Entrando...',
  passwordLabel = 'Senha',
  passwordPlaceholder = 'Digite sua senha',
  onSubmit: customSubmit,
  onDataChange,
  isSubmitting = false,
  passwordDisabled = false,
  buttonDisabled = false,
}) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = watch('email');
  const senha = watch('senha');
  const submitLoading = loading || isSubmitting;

  useEffect(() => {
    if (onDataChange) {
      onDataChange({ email, senha });
    }
  }, [email, senha, onDataChange]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (dataLogin) => {
    setLoading(true);

    try {
      // 1️⃣ LOGIN (Spring Security)
      const params = new URLSearchParams();
      params.append("username", dataLogin.email);
      params.append("password", dataLogin.senha);

      await axios.post(
        "http://localhost:8080/api/v1/login",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        }
      );

      // 2️⃣ BUSCAR USUÁRIO LOGADO
      const responseUser = await axios.get(
        "http://localhost:8080/api/v1/usuario/me",
        {
          withCredentials: true,
        }
      );

      const usuario = responseUser.data;

      console.log("Usuário logado:", usuario);

      // 3️⃣ SALVAR NO CONTEXTO
      login({
        id: usuario.id,
        email: usuario.username,
        accessLevel: usuario.nivelAcesso,
        nome: usuario.nome,
      });

      localStorage.setItem("user", JSON.stringify(usuario));

      toast.success("Login realizado com sucesso!");
      navigate("/");

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        toast.error("Usuário ou senha inválidos");
      } else {
        toast.error("Erro ao conectar com o servidor");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-wrapper">
      <img className="img-edit" src={LogoLogin} alt="Logo DivulgAí" />

      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <label className="login-form">
          <div className="email-margin">Email</div>
          <div className="input-icon-wrapper">
            <FaRegEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Digite seu email"
              {...register('email', { required: 'Email é obrigatório' })}
            />
          </div>
          {errors.email && <span className="error">{errors.email.message}</span>}
        </label>

        <label className="login-form">
          <div className="password-margin">{passwordLabel}</div>
          <div className="input-icon-wrapper">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={passwordPlaceholder}
              disabled={passwordDisabled}
              {...register('senha', { required: 'Senha é obrigatória' })}
            />
            {showPassword ? (
              <FaEyeSlash className="eye-icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaEye className="eye-icon" onClick={togglePasswordVisibility} />
            )}
          </div>
          {errors.senha && <span className="error">{errors.senha.message}</span>}
        </label>

        <button type="submit" disabled={submitLoading || buttonDisabled}>
          {submitLoading ? loadingText : buttonText}
        </button>
      </form>
    </div>
  );
}
