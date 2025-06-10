import React from 'react';
import { useForm } from "react-hook-form";
import './CreatePerfil.css';
import { Link, useNavigate } from 'react-router-dom';
import SideMenu from '../../Components/SideMenu/SideMenu';

export default function CreatePerfil() {
  const navigate = useNavigate();  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(userData) {
    // Pega perfis salvos no localStorage
    const savedProfiles = JSON.parse(localStorage.getItem('perfis')) || [];

    // Adiciona novo perfil ao array
    savedProfiles.push(userData);

    // Salva de volta no localStorage
    localStorage.setItem('perfis', JSON.stringify(savedProfiles));

    navigate('/');
  }

  return (
    <div className='container-create-perfil'>
      <h1>CreatePerfil</h1>
      <Link to={"/"}>Home</Link>

      <SideMenu />

    <div className='container-forms'>  
      <div className="forms">
        <form onSubmit={handleSubmit(onSubmit)}>

          <label className="forms-label">
            Nome
            <input className="forms-input" {...register("name", { required: true })} />
          </label>
          {errors.name && <span className='forms-span'>Campo obrigatório</span>}

          <label className="forms-label">
            Descrição
            <input className="forms-input" {...register("description", { required: true })} />
          </label>
          {errors.description && <span className='forms-span'>Campo obrigatório</span>}

          <label className="forms-label">
            Contato
            <input className="forms-input" {...register("contact", { required: true })} />
          </label>
          {errors.contact && <span className='forms-span'>Campo obrigatório</span>}

          <label className="forms-label">
            Local
            <input className="forms-input" {...register("local", { required: true })} />
          </label>
          {errors.local && <span className='forms-span'>Campo obrigatório</span>}

          <label className="forms-label">
            Categoria
            <input className="forms-input" {...register("categoria", { required: true })} />
          </label>
          {errors.categoria && <span className='forms-span'>Campo obrigatório</span>}

          <button type="submit" className="forms-button">Enviar</button>
        </form>
      </div>
    </div>
  </div>  
  );
}
