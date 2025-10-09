import React, { useState } from 'react';
import axios from 'axios';
import LogoLogin from '../../img/DivulgAÍ-removebg-preview.png';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaRegEnvelope } from 'react-icons/fa';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6';

import { useAuth } from '../../Components/AuthContext';
import accessLevels from '../../Components/accessLevels';

export default function Login({ buttonText = "Entrar" }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (dataLogin) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/Usuario');
      const usuarios = response.data;

      const usuarioEncontrado = usuarios.find(
        (u) => 
          u.email.toLowerCase().trim() === dataLogin.email.toLowerCase().trim() &&
          u.senha === dataLogin.senha
      );


      if (!usuarioEncontrado) {
        alert('Email ou senha incorretos.');
        return;
      }

      const level = usuarioEncontrado.nivelAcesso || accessLevels.CLIENTE;

      login({ email: usuarioEncontrado.email, accessLevel: level });
      localStorage.setItem('userLevel', level);

      navigate('/');
    } catch (error) {
      console.error('Erro ao autenticar:', error.response?.data || error.message);
      alert('Erro ao conectar com o servidor.');
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
          <div className="password-margin">Senha</div>
          <div className="input-icon-wrapper">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
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

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : buttonText}
        </button>
      </form>
    </div>
  );
}
