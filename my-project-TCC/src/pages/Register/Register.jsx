// Importa dependências principais e estilos
import React, { useState } from 'react';
import { useAuth } from '../../Components/AuthContext';
import './Register.css';
import accessLevels from '../../Components/accessLevels';
import { Link, useNavigate } from 'react-router-dom'; // Navegação SPA
import LogoRegister from '../../img/DivulgAÍ-removebg-preview.png'; 
import { useForm } from 'react-hook-form'; // Lib de formulários react
import { FaRegEnvelope } from "react-icons/fa";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";  

export default function Register() {
  // Hook para redirecionar o usuário programaticamente
  const navigate = useNavigate();
  const { login } = useAuth();

  // Inicializa react-hook-form com algumas funções úteis
  const {
    register,        // registra inputs para validação/controlar valor
    handleSubmit,    // função que lida com envio do form
    watch,           // observa valor de campos em tempo real
    formState: { errors } // erros de validação
  } = useForm();

  // Estado para mostrar/esconder senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Alterna visibilidade da senha principal
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Alterna visibilidade da confirmação de senha
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Observa o campo 'password' para validar se confirmPassword bate com ele
  const password = watch('password');

  // Função executada ao submeter o formulário corretamente
const onSubmit = (data) => {
  console.log(data);

login({
  email: data.email,
  accessLevel: accessLevels.CLIENTE, // isso vai ser 2, número
});

  navigate('/security-questions');
};



  return (
    <div className='register-container'>
      {/* Logo na parte superior */}
      <div className="register-image-wrapper">
        <img src={LogoRegister} alt="Logo DivulgAí" className="register-logo" />
      </div>

      {/* Formulário principal */}
      <div className='register-form-wrapper'>
        <h1 className='register-title'>Cadastro</h1>
        <h3 className='register-subtitle'>
          Se você já possui uma conta,<br />
          você pode <Link to={'/login'} className="register-link">Logar aqui!</Link>
        </h3>

        {/* Formulário controlado pelo react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">

          {/* Campo de Email */}
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

          {/* Campo de Nome / Apelido */}
          <label className="register-label">
            <div>Nome</div>
            <div className="register-input-icon-wrapper">
              <IoPersonOutline className="register-input-icon" />
              <input
                type="text"
                placeholder="Digite seu apelido"
                {...register('name', { required: 'Seu apelido é obrigatório' })}
              />
            </div>
            {errors.name && <span className="register-error">{errors.name.message}</span>}
          </label>

          {/* Campo de Senha com botão de exibir/esconder */}
          <label className="register-label">
            <div>Senha</div>
            <div className="register-input-icon-wrapper">
              <FaLock className="register-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'} // mostra ou esconde senha
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

          {/* Campo de Confirmar Senha com validação de igualdade */}
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

          {/* Botão de envio */}
          <button type="submit" className="register-button">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}
