import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import './CreatePerfil.css';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../../Components/SideMenu/SideMenu';
import { FiUpload } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";
import { FaRegEnvelope, FaCoffee } from "react-icons/fa";
import { IoPersonCircleOutline, IoCallOutline, IoLocationOutline} from "react-icons/io5";

export default function CreatePerfil() {
  const navigate = useNavigate();

  // Estados para os dois arquivos
  const [selectedFileName1, setSelectedFileName1] = useState("");
  const [imagePreview1, setImagePreview1] = useState(null);

  const [selectedFileName2, setSelectedFileName2] = useState("");
  const [imagePreview2, setImagePreview2] = useState(null);

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

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName1(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview1(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName2(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview2(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='all-page'>
      <div className='create-perfil-header'>
        <div className="header-layout">
          {/* Lado esquerdo: Upload circular */}
          <div className="header-upload">
            <label className="forms-label">
              <input
                id="forms-archive-2"
                type="file"
                accept="image/*"
                {...register("arquivo2", { required: true })}
                onChange={handleFileChange2}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="custom-upload-button-profile"
                onClick={() => document.getElementById('forms-archive-2').click()}
              >
                {imagePreview2 ? (
                  <img src={imagePreview2} alt="Preview 2" className="image-preview-inside-button" />
                ) : (
                  <FiUpload className='upload-icon-edit'/>
                )}
              </button>
              {errors.arquivo2 && <span className="forms-span">Campo obrigatório</span>}
            </label>
          </div>

          {/* Lado direito: Textos */}
          <div className="header-text">
            <h1>CRIAÇÃO DE PERFIL</h1>
            <h2>Essas informações ficarão visíveis <br />para todos os usuários</h2>
          </div>
        </div>

        <div className='container-create-perfil'>
          <div className='container-forms'>
            <div className='container-sidemenu'>
              <SideMenu />
            </div>

            <div className="forms">
              <form onSubmit={handleSubmit(onSubmit)}>

                {/* Nome */}
                <label className="forms-label">
                  <div className='create-profile-icon'>
                    <IoPersonCircleOutline className='icon-profile' />
                    <span>Nome</span>
                  </div>
                  <input className="forms-input" placeholder="Digite o nome do seu serviço" {...register("name", { required: true })} />
                  {errors.name && <span className='forms-span'>Campo obrigatório</span>}
                </label>

                {/* Descrição */}
                <label className="forms-label">
                  <div className='create-profile-icon'>
                    <FaRegEnvelope className='icon-profile' />
                    <span>Descrição</span>
                  </div>
                  <input className="forms-input" placeholder="Digite aqui a descrição" {...register("description", { required: true })} maxLength={50} />
                  {errors.description && <span className='forms-span'>Campo obrigatório</span>}
                </label>

                {/* Contato */}
                <label className="forms-label">
                  <div className='create-profile-icon'>
                    <IoCallOutline className='icon-profile' />
                    <span>Contato</span>
                  </div>
                  <input className="forms-input" placeholder="Coloque aqui os contatos" {...register("contact", { required: true })} />
                  {errors.contact && <span className='forms-span'>Campo obrigatório</span>}
                </label>

                {/* Local */}
                <label className="forms-label">
                  <div className='create-profile-icon'>
                    <IoLocationOutline className='icon-profile' />
                    <span>Local</span>
                  </div>
                  <input className="forms-input" placeholder="Selecione o local" {...register("local", { required: true })} />
                  {errors.local && <span className='forms-span'>Campo obrigatório</span>}
                </label>

                {/* Categoria */}
                <label className="forms-label">
                  <div className='create-profile-icon'>
                    <FaCoffee className='icon-profile' />
                    <span>Categoria</span>
                  </div>
                  <select className="forms-input"  defaultValue="" {...register("categoria", { required: true })}>
                    <option value="" disabled>Selecione a categoria</option>
                    <option value="Comidas Prontas">Comidas Prontas</option>
                    <option value="Lanches e Fast Food">Lanches e Fast Food</option>
                    <option value="Doces e Sobremesas">Doces e Sobremesas</option>
                    <option value="Padaria e Confeitaria">Padaria e Confeitaria</option>
                    <option value="Sucos naturais">Sucos naturais</option>
                    <option value="Drinks artesanais">Drinks artesanais </option>
                    <option value="Cafés e chás especiais">Cafés e chás especiais</option>
                    <option value="Saudável e Fitness">Saudável e Fitness</option>
                    <option value="Comida italiana">Comida italiana</option>  
                    <option value="Comida japonesa">Comida japonesa</option>
                    <option value="Comida nordestina">Comida nordestina</option>
                    <option value="Comida árabe">Comida árabe</option>
                    <option value="Comida mexicana">Comida mexicana</option>
                    <option value="Buffet para festas">Buffet para festas</option>                                                                                 
                  </select>
                   
                  {errors.categoria && <span className='forms-span'>Campo obrigatório</span>}
                </label>

                {/* Upload retangular */}
<label className="forms-label">
  {/* 1. Container do ícone e texto */}
  <div className='create-profile-icon'>
    <FaRegImage className='icon-profile' />  {/* Ícone do upload */}
    <span>Arquivo</span>                   {/* Texto do label */}
  </div>

  {/* 2. Input file invisível */}
  <input
    id="forms-archive-1"
    type="file"
    accept="image/*"
    {...register("arquivo1", { required: true })}
    onChange={handleFileChange1}
    style={{ display: 'none' }}
  />

  {/* 3. Botão personalizado que dispara o input file */}
  <button
    type="button"
    className="custom-upload-button-banner"
    onClick={() => document.getElementById('forms-archive-1').click()}
  >
    {imagePreview1 ? (
      <img src={imagePreview1} alt="Preview 1" className="image-preview-inside-button" />
    ) : (
      "Escolher arquivo"
    )}
  </button>

  {/* 5. Mensagem de erro caso não tenha arquivo */}
  {errors.arquivo1 && <span className="forms-span">Campo obrigatório</span>}
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
