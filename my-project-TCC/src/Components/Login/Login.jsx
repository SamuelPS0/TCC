import React from 'react';
import LogoLogin from '../../img/DivulgAÍ-removebg-preview.png';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaRegEnvelope } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa6';

import {useAuth} from '../../Components/AuthContext';
import accessLevels from '../../Components/accessLevels';

export default function Login({ buttonText = "Entrar" }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

const onSubmit = (dataLogin) => {
  const level = dataLogin.email === 'admin@exemplo.com'
    ? accessLevels.ADMIN
    : dataLogin.email === 'prestador@exemplo.com'
      ? accessLevels.PRESTADOR
      : accessLevels.CLIENT;

  login({ email: dataLogin.email, accessLevel: level });
  localStorage.setItem('userLevel', level);
  navigate('/');
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
              type="password"
              placeholder="Digite sua senha"
              {...register('senha', { required: 'Senha é obrigatória' })}
            />
          </div>
          {errors.senha && <span className="error">{errors.senha.message}</span>}
        </label>

        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
}
