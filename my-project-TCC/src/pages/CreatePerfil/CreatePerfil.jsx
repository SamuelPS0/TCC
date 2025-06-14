import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import './CreatePerfil.css';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../../Components/SideMenu/SideMenu';
import { FiUpload } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";
import { FaRegEnvelope, FaCoffee } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { IoPersonCircleOutline, IoLocationOutline } from "react-icons/io5";
import { MdAddLocationAlt } from "react-icons/md";

export default function CreatePerfil() {
  const navigate = useNavigate();

  const [selectedFileName1, setSelectedFileName1] = useState("");
  const [imagePreview1, setImagePreview1] = useState(null);

  const [selectedFileName2, setSelectedFileName2] = useState("");
  const [imagePreview2, setImagePreview2] = useState(null);

  const [localInput, setLocalInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [showRegionInput, setShowRegionInput] = useState(false);

  const [contacts, setContacts] = useState([""]);

  const {
    register,
    handleSubmit,
    setValue,
    unregister,
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
      reader.onloadend = () => setImagePreview1(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName2(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview2(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      if (localInput.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
        const data = await res.json();
        const filtered = data
          .filter(city => city.nome.toLowerCase().includes(localInput.toLowerCase()))
          .slice(0, 5)
          .map(city => ({
            display: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`,
            nome: city.nome,
            uf: city.microrregiao.mesorregiao.UF.sigla
          }));

        setSuggestions(filtered);
      } catch {
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(fetchCities, 300);
    return () => clearTimeout(delayDebounce);
  }, [localInput]);

  const handleSelectSuggestion = (cidadeObj) => {
    const fullString = `${cidadeObj.nome} - ${cidadeObj.uf}`;
    setValue("local", fullString);
    setLocalInput(fullString);
    setSuggestions([]);
  };

  const handleAddRegion = () => setShowRegionInput(true);
  const handleRemoveRegion = () => {
    setShowRegionInput(false);
    unregister("region");
  };

  const handleContactChange = (index, value) => {
    const newContacts = [...contacts];
    newContacts[index] = value;
    setContacts(newContacts);
    setValue(`contact[${index}]`, value);
  };

  const handleAddContact = () => setContacts([...contacts, ""]);

  const handleRemoveContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
    unregister(`contact[${index}]`);
    newContacts.forEach((c, i) => setValue(`contact[${i}]`, c));
  };

  return (
    <div className="all-page">
      <div className="create-perfil-header">
        <div className="header-layout">
          <div className="header-upload">
            <label className="forms-label">
              <input
                id="forms-archive-2"
                type="file"
                accept="image/*"
                {...register("arquivo2", { required: true })}
                onChange={handleFileChange2}
              />
              <button
                type="button"
                className="custom-upload-button-profile"
                onClick={() => document.getElementById('forms-archive-2').click()}
              >
                {imagePreview2 ? (
                  <img src={imagePreview2} alt="Preview 2" className="image-preview-inside-button" />
                ) : (
                  <FiUpload className="upload-icon-edit" />
                )}
              </button>
              {errors.arquivo2 && <span className="forms-span">Campo obrigatório</span>}
            </label>
          </div>

          <div className="header-text">
            <h1>CRIAÇÃO DE PERFIL</h1>
            <h2>Essas informações ficarão visíveis <br />para todos os usuários</h2>
          </div>
        </div>

        <div className="container-create-perfil">
          <div className="container-forms">
            <div className="container-sidemenu">
              <SideMenu />
            </div>

            <div className="forms">
              <form onSubmit={handleSubmit(onSubmit)}>

                <label className="forms-label">
                  <div className="create-profile-icon">
                    <IoPersonCircleOutline className="icon-profile" />
                    <span>Nome</span>
                  </div>
                  <input
                    className="forms-input"
                    placeholder="Digite o nome do seu serviço"
                    {...register("name", { required: true })}
                    maxLength={24}
                  />
                  {errors.name && <span className="forms-span">Campo obrigatório</span>}
                </label>

                <label className="forms-label">
                  <div className="create-profile-icon">
                    <FaRegEnvelope className="icon-profile" />
                    <span>Descrição</span>
                  </div>
                  <input
                    className="forms-input"
                    placeholder="Digite aqui a descrição"
                    {...register("description", { required: true })}
                    maxLength={104}
                  />
                  {errors.description && <span className="forms-span">Campo obrigatório</span>}
                </label>

                <label className="forms-label">
                  <div className="create-profile-icon">
                    <FaLink className="icon-profile" />
                    <span>Contato</span>
                  </div>
                  <span className='reminder-text'>
                    Certifique-se de que seu link está correto! - As pessoas acessarão suas redes através dele.
                  </span>

                  {contacts.map((contact, index) => (
                    <div key={index} className="input-with-button">
                      <input
                        className="forms-input"
                        placeholder="Ex: https://www.seuperfil.com"
                        value={contact}
                        {...register(`contact[${index}]`, { required: true })}
                        onChange={(e) => handleContactChange(index, e.target.value)}
                        autoComplete="off"
                      />

                      {index === contacts.length - 1 && (
                        <button
                          type="button"
                          className="button-add-region"
                          onClick={handleAddContact}
                          aria-label="Adicionar contato"
                        >
                          +
                        </button>
                      )}

                      {contacts.length > 1 && index !== 0 && (
                        <button
                          type="button"
                          className="button-remove-region"
                          onClick={() => handleRemoveContact(index)}
                          aria-label="Remover contato"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  {errors.contact && <span className="forms-span">Campo obrigatório</span>}
                </label>

                <label className="forms-label">
                  <div className="create-profile-icon">
                    <IoLocationOutline className="icon-profile" />
                    <span>Local</span>
                  </div>
                  <div className="input-with-button">
                    <input
                      className="forms-input"
                      placeholder="Digite a cidade"
                      {...register("local", { required: true })}
                      value={localInput}
                      onChange={(e) => setLocalInput(e.target.value)}
                      autoComplete="off"
                    />
                    {!showRegionInput && (
                      <button
                        type="button"
                        className="button-add-region"
                        onClick={handleAddRegion}
                        aria-label="Adicionar região"
                      >
                        +
                      </button>
                    )}
                  </div>
                  {errors.local && <span className="forms-span">Campo obrigatório</span>}

                  {suggestions.length > 0 && (
                    <ul className="autocomplete-suggestions">
                      {suggestions.map((cidadeObj, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectSuggestion(cidadeObj)}
                          className="autocomplete-item"
                        >
                          {cidadeObj.display}
                        </li>
                      ))}
                    </ul>
                  )}
                </label>

                {showRegionInput && (
                  <label className="forms-label">
                    <div className="create-profile-icon">
                      <MdAddLocationAlt className="icon-profile" />
                      <span>Região</span>
                    </div>
                    <div className="input-with-button">
                      <input
                        className="forms-input"
                        placeholder="Digite a região"
                        {...register("region", { required: true })}
                      />
                      <button
                        type="button"
                        className="button-remove-region"
                        onClick={handleRemoveRegion}
                        aria-label="Remover região"
                      >
                        ×
                      </button>
                    </div>
                    {errors.region && <span className="forms-span">Campo obrigatório</span>}
                  </label>
                )}

                <label className="forms-label">
                  <div className="create-profile-icon">
                    <FaCoffee className="icon-profile" />
                    <span>Categoria</span>
                  </div>
                  <select className="forms-input" defaultValue="" {...register("categoria", { required: true })}>
                    <option value="" disabled>Selecione a categoria</option>
                    <option value="Comidas Prontas">Comidas Prontas</option>
                    <option value="Lanches e Fast Food">Lanches e Fast Food</option>
                    <option value="Doces e Sobremesas">Doces e Sobremesas</option>
                    <option value="Padaria e Confeitaria">Padaria e Confeitaria</option>
                    <option value="Sucos naturais">Sucos naturais</option>
                    <option value="Drinks artesanais">Drinks artesanais</option>
                    <option value="Cafés e chás especiais">Cafés e chás especiais</option>
                    <option value="Saudável e Fitness">Saudável e Fitness</option>
                    <option value="Comida italiana">Comida italiana</option>
                    <option value="Comida japonesa">Comida japonesa</option>
                    <option value="Comida nordestina">Comida nordestina</option>
                    <option value="Comida árabe">Comida árabe</option>
                    <option value="Comida mexicana">Comida mexicana</option>
                    <option value="Buffet para festas">Buffet para festas</option>
                  </select>
                  {errors.categoria && <span className="forms-span">Campo obrigatório</span>}
                </label>

                <label className="forms-label">
                  <div className="create-profile-icon">
                    <FaRegImage className="icon-profile" />
                    <span>Arquivo</span>
                  </div>
                  <input
                    id="forms-archive-1"
                    type="file"
                    accept="image/*"
                    {...register("arquivo1", { required: true })}
                    onChange={handleFileChange1}
                  />
                  <button
                    type="button"
                    className="custom-upload-button-banner"
                    onClick={() => document.getElementById('forms-archive-1').click()}
                  >
                    {imagePreview1 ? (
                      <img src={imagePreview1} alt="Preview 1" className="image-preview-inside-button" />
                    ) : (
                      <FiUpload className='upload-icon-edit-2' />
                    )}
                  </button>
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
