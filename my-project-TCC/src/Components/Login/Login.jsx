import React from 'react';
import LogoLogin from '../../img/DivulgAÍ-removebg-preview.png';
import './Login.css';
import {useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { FaRegEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";

// Componente funcional Login recebe uma prop opcional buttonText com valor padrão "Entrar"
export default function Login({ buttonText = "Entrar" }) {
  
  // Hook do React Router para navegação
  const navigate = useNavigate();

  // Hook do react-hook-form para lidar com formulários
  const {
    register,       // Função para registrar os campos do formulário
    handleSubmit,   // Função para tratar o submit do formulário
    formState: { errors } // Objeto que contém os erros de validação dos campos
  } = useForm();

  // Função chamada quando o formulário for enviado *com sucesso*
  const onSubmit = (dataLogin) => {
    console.log(dataLogin);  // Exibe os dados do formulário no console (garantia)
    navigate("/");           // Redireciona o usuário para a rota inicial (ou home) "/"
  };

  return (
    <div className="login-wrapper"> {/* Container principal da página de login */}

      {/* Logo da aplicação */}
      <img className='img-edit' src={LogoLogin} alt="Logo DivulgAí" />

      {/* Formulário de login, onSubmit executa a validação e chama onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">

        {/* Campo de email */}
        <label className="login-form">
          <div className="email-margin">Email</div> {/* Label visual */}
          <div className="input-icon-wrapper">
            {/* Ícone de envelope */}
            <FaRegEnvelope className="input-icon" />
            {/* Input de email com validação obrigatória */}
            <input
              type="email"
              placeholder="Digite seu email"
              {...register('email', { required: 'Email é obrigatório' })}
            />
          </div>
          {/* Exibe mensagem de erro caso email não seja preenchido */}
          {errors.email && <span className="error">{errors.email.message}</span>}
        </label>

        {/* Campo de senha */}
        <label className="login-form">
          <div className="password-margin">Senha</div> {/* Label visual */}
          <div className="input-icon-wrapper">
            {/* Ícone de cadeado */}
            <FaLock className="input-icon" />
            {/* Input de senha com validação obrigatória */}
            <input
              type="password"
              placeholder="Digite sua senha"
              {...register('senha', { required: 'Senha é obrigatória' })}
            />
          </div>
          {/* Exibe mensagem de erro caso senha não seja preenchida */}
          {errors.senha && <span className="error">{errors.senha.message}</span>}
        </label>

        {/* Botão de submit do formulário */}
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
}

