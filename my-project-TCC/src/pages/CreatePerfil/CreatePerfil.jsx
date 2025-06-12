import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import './CreatePerfil.css';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../../Components/SideMenu/SideMenu';
import { FaRegEnvelope, FaCoffee } from "react-icons/fa";
import { IoPersonCircleOutline, IoCallOutline, IoLocationOutline } from "react-icons/io5";

export default function CreatePerfil() {
  const navigate = useNavigate();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFileName("");
      setImagePreview(null);
    }
  };

  return (
    <div className='all-page'>
      <div className='create-perfil-header'>
        <h1>Criação de perfil</h1>
        <h2>Essas informações ficarão visíveis<br />para todos os usuários</h2>

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
                  <select className="forms-input" defaultValue="" {...register("categoria", { required: true })}>
                    <option value="" disabled>Selecione a categoria</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Fullstack</option>
                  </select>
                  {errors.categoria && <span className='forms-span'>Campo obrigatório</span>}
                </label>

                {/* Upload */}
                <label className="forms-label">
                  <div className='create-profile-icon'>
                    <FaRegEnvelope className='icon-profile' />
                    <span>Arquivo</span>
                  </div>

                  <input
                    id="forms-archive"
                    type="file"
                    accept="image/*"
                    {...register("arquivo", { required: true })}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    className="custom-upload-button"
                    onClick={() => document.getElementById('forms-archive').click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview-inside-button" />
                    ) : (
                      "Escolher arquivo"
                    )}
                  </button>

                  {selectedFileName && (
                    <span className="selected-file-name">Selecionado: {selectedFileName}</span>
                  )}

                  {errors.arquivo && <span className="forms-span">Campo obrigatório</span>}
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
