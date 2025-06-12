import React from 'react';
import { useForm } from "react-hook-form";
import './CreatePerfil.css';
import { Link, useNavigate } from 'react-router-dom';
import SideMenu from '../../Components/SideMenu/SideMenu';
import { FaRegEnvelope } from "react-icons/fa";
import { FaCoffee } from "react-icons/fa";

import { 
  IoPersonCircleOutline, 
  IoDocumentTextOutline, 
  IoCallOutline, 
  IoLocationOutline, 
  IoListOutline 
} from "react-icons/io5";

export default function CreatePerfil() {
  const navigate = useNavigate();  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(userData) {
    const savedProfiles = JSON.parse(localStorage.getItem('perfis')) || [];
    savedProfiles.push(userData);
    localStorage.setItem('perfis', JSON.stringify(savedProfiles));
    navigate('/');
  }


  
  return (
    <div className='all-page'>
    <div className='create-perfil-header'>
      <h1>Criação de perfil</h1>
      <h2>Essas informações ficarão visíveis<br></br> para todos os úsuarios</h2>
    <div className='container-create-perfil'>
      <div className='container-forms'>  
        <div className='container-sidemenu'>
        <SideMenu />
        </div>
        <div className="forms">
          <form onSubmit={handleSubmit(onSubmit)}>

            <label className="forms-label">
              <div className='create-profile-icon'>
                <IoPersonCircleOutline className='icon-profile' />
                <span>Nome</span>
              </div>
              <input className="forms-input" placeholder="Digite o nome do seu serviço" {...register("name", { required: true })} />
              {errors.name && <span className='forms-span'>Campo obrigatório</span>}
            </label>

            <label className="forms-label">
              <div className='create-profile-icon'>
                <FaRegEnvelope className='icon-profile' />
                <span>Descrição</span>
              </div>
              <input className="forms-input" placeholder="Digite aqui a descrição" {...register("description", { required: true })} />
              {errors.description && <span className='forms-span' maxLength={50}>Campo obrigatório</span>}
            </label>

            <label className="forms-label">
              <div className='create-profile-icon'>
                <IoCallOutline className='icon-profile' />
                <span>Contato</span>
              </div>
              <input className="forms-input" placeholder="Coloque aqui os contatos" {...register("contact", { required: true })} />
              {errors.contact && <span className='forms-span'>Campo obrigatório</span>}
            </label>

            <label className="forms-label">
              <div className='create-profile-icon'>
                <IoLocationOutline className='icon-profile' />
                <span>Local</span>
              </div>
              <input className="forms-input" placeholder="Selecione o local" {...register("local", { required: true })} />
              {errors.local && <span className='forms-span'>Campo obrigatório</span>}
            </label>

            <label className="forms-label">
              <div className='create-profile-icon'>
                <FaCoffee className='icon-profile' />
                <span>Categoria</span>
              </div>
              <input className="forms-input" placeholder="Selecione a categoria" {...register("categoria", { required: true })} />
              {errors.categoria && <span className='forms-span'>Campo obrigatório</span>}
            </label>
            

          


            <button type="submit" className="forms-button">Enviar</button>
          </form>
        </div>
      </div>
    </div> 
  </div>
</div>
  );
}
