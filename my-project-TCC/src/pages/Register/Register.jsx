import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import LogoRegister from '../../img/DivulgAÍ-removebg-preview.png';
import { useForm } from 'react-hook-form';
import { FaRegEnvelope } from "react-icons/fa";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";  

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const password = watch('password');

  const onSubmit = (data) => {
    console.log(data); // aqui você pode enviar os dados para API, etc
    navigate("/");     // navega para a home após sucesso
  };

  return (
    <div className='register-container'>
      <div className="register-image-wrapper">
        <img src={LogoRegister} alt="Logo DivulgAí" className="register-logo" />
      </div>
      <div className='register-form-wrapper'>
        <h1 className='register-title'>Cadastro</h1>
        <h3 className='register-subtitle'>
          Se você já possui uma conta,<br />
          você pode <Link to={'/login'} className="register-link">Logar aqui!</Link>
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <label className="register-label">
            <div>Email</div>
            <div className="register-input-icon-wrapper">
              <FaRegEnvelope className="register-input-icon" />
              <input
                type="email"
                placeholder="Digite seu email"
                {...register('email', { required: 'Email é obrigatório' })}
              />
            </div>
            {errors.email && <span className="register-error">{errors.email.message}</span>}
          </label>

          <label className="register-label">
            <div>Nome</div>
            <div className="register-input-icon-wrapper">
              <IoPersonOutline  className="register-input-icon" />
              <input
                type="text"
                placeholder="Digite seu apelido"
                {...register('name', { required: 'Seu apelido é obrigatório' })}
              />
            </div>
            {errors.name && <span className="register-error">{errors.name.message}</span>}
          </label>

          <label className="register-label">
            <div>Senha</div>
            <div className="register-input-icon-wrapper">
              <FaLock className="register-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                {...register('password', { required: 'Sua senha é obrigatória' })}
              />
              {showPassword ? (
                <FaEyeSlash className="register-eye-icon" onClick={togglePasswordVisibility} />
              ) : (
                <FaEye className="register-eye-icon" onClick={togglePasswordVisibility} />
              )}
            </div>
            {errors.password && <span className="register-error">{errors.password.message}</span>}
          </label>

          <label className="register-label">
            <div>Confirmar Senha</div>
            <div className="register-input-icon-wrapper">
              <FaLock className="register-input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                {...register('confirmPassword', {
                  required: 'Confirme sua senha',
                  validate: (value) =>
                    value === password || 'As senhas não coincidem'
                })}
              />
              {showConfirmPassword ? (
                <FaEyeSlash className="register-eye-icon" onClick={toggleConfirmPasswordVisibility} />
              ) : (
                <FaEye className="register-eye-icon" onClick={toggleConfirmPasswordVisibility} />
              )}
            </div>
            {errors.confirmPassword && (
              <span className="register-error">{errors.confirmPassword.message}</span>
            )}
          </label>

          <button type="submit" className="register-button">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}
