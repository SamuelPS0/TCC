import React from 'react';
import LogoLogin from '../../img/DivulgAÍ-removebg-preview.png';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { FaRegEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (dataLogin) => {
    console.log(dataLogin);
    navigate("/");
  };

  return (
    <div className='background-login'>
      <div className='login-container'>
        <div className="login-wrapper">
          <img className='img-edit' src={LogoLogin} alt="Logo DivulgAí" />

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

            <button type="submit">Entrar</button>
            <Link to={"/forgot-password"} className='forgot-quick-edit'>Esqueceu a senha?</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
