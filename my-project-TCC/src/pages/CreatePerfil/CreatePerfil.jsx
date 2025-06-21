import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import './CreatePerfil.css';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../../Components/SideMenu/SideMenu';
import { FiUpload } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";
import { FaRegEnvelope, FaCoffee, FaInstagram, FaFacebook, FaWhatsapp   } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { IoPersonCircleOutline, IoLocationOutline } from "react-icons/io5";
import { MdAddLocationAlt } from "react-icons/md";

export default function CreatePerfil() {
  const navigate = useNavigate(); // Hook para navegação programática

  // Estado para armazenar nome e preview da primeira imagem (arquivo1)
  const [selectedFileName1, setSelectedFileName1] = useState("");
  const [imagePreview1, setImagePreview1] = useState(null);

  // Estado para armazenar nome e preview da segunda imagem (arquivo2)
  const [selectedFileName2, setSelectedFileName2] = useState("");
  const [imagePreview2, setImagePreview2] = useState(null);

  // Estado para o input de local e sugestões para autocomplete de cidades
  const [localInput, setLocalInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Controla se o campo de região está visível ou não
  const [showRegionInput, setShowRegionInput] = useState(false);

  // Estado para armazenar contatos, começa com um contato vazio
const [contacts, setContacts] = useState([
  { value: "", placeholder: "Selecione os contatos", label: "" }
]);



  // Inicialização do react-hook-form para controle do formulário
  const {
    register,
    handleSubmit,
    setValue,
    unregister,
    formState: { errors },
  } = useForm();

function onSubmit(userData) {
  // Adiciona as imagens base64 (previews)
  userData.imagem1 = imagePreview1;
  userData.imagem2 = imagePreview2;

  // Junta contatos válidos (que tenham value preenchido)
  const contatosFiltrados = contacts
    .map((c, i) => ({
      label: c.label,
      value: userData.contact?.[i]?.value || ''
    }))
    .filter(c => c.value !== '');

  userData.contacts = contatosFiltrados;

  // Remove a versão antiga de contact se quiser
  delete userData.contact;

  const savedProfiles = JSON.parse(localStorage.getItem('perfis')) || [];
  savedProfiles.push(userData);
  localStorage.setItem('perfis', JSON.stringify(savedProfiles));

  navigate('/home-list');
}



  // Função para lidar com mudança no arquivo 1, atualizando nome e preview da imagem
const handleFileChange1 = (e) => {
  const file = e.target.files[0];
  console.log('file:', file);

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      console.log('reader.onload:', reader.result);
      setImagePreview1(reader.result);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
  }
};



  // Função para lidar com mudança no arquivo 2, atualizando nome e preview da imagem
  // Mesmo esquema explicado no caso anterior
  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName2(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview2(reader.result);
      reader.readAsDataURL(file);
    }
  };

// useEffect para buscar cidades via API com base no input de local
useEffect(() => {
  // Função assíncrona (funciona ao mesmo tempo que o site roda) para buscar as cidades da API do IBGE
  const fetchCities = async () => {
    // Se o input de local tiver menos de 3 caracteres, limpa sugestões e não faz a busca
    if (localInput.length < 3) {
      setSuggestions([]); // Limpa sugestões se input tiver menos de 3 caracteres
      return;
    }



    
      try {
        // Busca lista completa de municípios (API)
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
        const data = await res.json();

      // Filtra os municípios que contêm o texto digitado no input localInput, ignorando maiúsculas/minúsculas
      const filtered = data
        .filter(city => city.nome.toLowerCase().includes(localInput.toLowerCase()))
        // Limita o resultado às 5 primeiras sugestões para não sobrecarregar a lista
        .slice(0, 5)
        // Mapeia cada cidade filtrada para um objeto com as propriedades necessárias para exibir na lista de sugestões:
      // 'display' que junta o nome da cidade e a sigla do estado,
      // 'nome' que é o nome da cidade,
      // 'uf' que é a sigla do estado.
        .map(city => ({
          display: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`,
          nome: city.nome,
          uf: city.microrregiao.mesorregiao.UF.sigla
        }));


        setSuggestions(filtered);
      } catch {
        setSuggestions([]); // Em caso de erro, limpa sugestões
      }
    };

    // Faz debounce para não buscar a cada tecla digitada instantaneamente
    // Evitar lentidão no sistema
    const delayDebounce = setTimeout(fetchCities, 300);
    return () => clearTimeout(delayDebounce); // Limpa timeout ao desmontar ou mudar input
  }, [localInput]);

  // Quando o usuário seleciona uma sugestão, atualiza o input e limpa as sugestões
  const handleSelectSuggestion = (cidadeObj) => {
    const fullString = `${cidadeObj.nome} - ${cidadeObj.uf}`;
    setValue("local", fullString);
    setLocalInput(fullString);
    setSuggestions([]);
  };

    // Mostra o campo para adicionar a região no formulário, ativando sua exibição
    const handleAddRegion = () => setShowRegionInput(true);

    // Esconde o campo de região e remove o registro dele do formulário para evitar erros na validação
    const handleRemoveRegion = () => {
      setShowRegionInput(false);
      unregister("region"); // Remove o campo 'region' do controle do react-hook-form
    };


      // Atualiza o valor do contato no índice especificado e sincroniza essa alteração com o react-hook-form
          const handleContactChange = (index, value) => {
            const newContacts = [...contacts];
            newContacts[index] = {
              ...newContacts[index],
              value: value
            };
            setContacts(newContacts);
            setValue(`contact[${index}].value`, value);
          };

          const handleAddContactWithValue = (label) => {
            const newContact = {
              value: "",
              label: label,
              placeholder: `Ex: https://www.${label}.com`
            };
            setContacts([...contacts, newContact]);
            setValue(`contact[${contacts.length}].value`, ""); // Inicializa vazio no react-hook-form
            setShowContactDropdown(false);
          };

      // Adicionar o estado de dropdown para seleção
      const [showContactDropdown, setShowContactDropdown] = useState(false);

      // Adiciona um novo campo vazio para contato no array de contatos
      const handleAddContact = () => setContacts([...contacts, ""]);

      // Remove o contato no índice especificado, atualiza o estado e sincroniza com react-hook-form
      const handleRemoveContact = (index) => {
        const newContacts = contacts.filter((_, i) => i !== index); // Remove o contato do índice
        setContacts(newContacts);                                   // Atualiza o estado com a lista filtrada
        unregister(`contact[${index}]`);                            // Remove o campo do react-hook-form
        // Reatribui os valores restantes para corrigir índices após remoção
        newContacts.forEach((c, i) => setValue(`contact[${i}]`, c));
      };


  return (
    <div className="all-page">
      <div className="create-perfil-header">
        <div className="header-layout">

          {/* Upload da imagem arquivo2 */}
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
                {/* Mostra preview da imagem ou ícone de upload */}
                {imagePreview2 ? (
                  <img src={imagePreview2} alt="Preview 2" className="image-preview-inside-button" />
                ) : (
                  <FiUpload className="upload-icon-edit" />
                )}
              </button>
              {/* Mensagem de erro se não preencher */}
              {errors.arquivo2 && <span className="forms-span">Campo obrigatório</span>}
            </label>
          </div>

          {/* Título e subtítulo do formulário */}
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

            {/* Formulário de criação de perfil */}
            <div className="forms">
              <form onSubmit={handleSubmit(onSubmit)}>

                {/* Campo Nome */}
                <label className="forms-label">
                  <div className="create-profile-icon">
                    <IoPersonCircleOutline className="icon-profile" />
                    <span className='span-color'>Nome</span>
                  </div>
                  <input
                    className="forms-input"
                    placeholder="Digite o nome do seu serviço"
                    {...register("name", { required: true })}
                    maxLength={24}
                  />
                  {errors.name && <span className="forms-span">Campo obrigatório</span>}
                </label>

                {/* Campo Descrição */}
                <label className="forms-label">
                  <div className="create-profile-icon">
                    <FaRegEnvelope className="icon-profile" />
                    <span className='span-color'>Descrição</span>
                  </div>
                  <input
                    className="forms-input"
                    placeholder="Digite aqui a descrição"
                    {...register("description", { required: true })}
                    maxLength={104}
                  />
                  {errors.description && <span className="forms-span">Campo obrigatório</span>}
                </label>

                {/* Campo Contatos Dinâmicos */}
                <label className="forms-label">
                  <div className="create-profile-icon">
                    <FaLink className="icon-profile" />
                    <span className='span-color'>Contato</span>
                  </div>
                  <span className='reminder-text'>
                    Certifique-se de que seu link está correto! - As pessoas acessarão suas redes através dele.
                  </span>

                  {/* Mapeia os contatos para inputs editáveis */}
                    {contacts.map((contact, index) => (
                      <div key={index} className="input-with-button">
                        <input
                          id="form-contact-input"
                          className="forms-input"
                          type="text"
                          placeholder={contact.placeholder}
                          readOnly={index === 0}  // Só o primeiro é readonly
                          value={contact.value}
                          {...register(`contact[${index}].value`, { required:index !== 0 })}
                          onChange={(e) => handleContactChange(index, e.target.value)}
                          autoComplete="off"
                        />
                        


                      {/* Botão para adicionar contato apenas no último input */}
                      {index === contacts.length -1 && (
                        <>
                            <button
                              type="button"
                              className="button-add-region"
                              onClick={() => setShowContactDropdown(!showContactDropdown)}
                              aria-label="Abrir opções de contato"
                            >
                              +
                            </button>

                            {showContactDropdown && (
                              <div className="dropdown-menu">                              
                                <button type="button" onClick={() => handleAddContactWithValue("Facebook")}><FaFacebook className='social-edit' id='facebook'/></button>
                                <button type="button" onClick={() => handleAddContactWithValue("Instagram")}><FaInstagram className='social-edit' id='instagram'/></button>
                                <button type="button" onClick={() => handleAddContactWithValue("WhatsApp")}><FaWhatsapp className='social-edit' id='whatsapp' /></button>
                              </div>
                            )}
                          </>
                      )}

                      {/* Botão para remover contato se houver mais de um e não for o primeiro */}
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

                {/* Campo Local com autocomplete */}
                <label className="forms-label">
                  <div className="create-profile-icon">
                    <IoLocationOutline className="icon-profile" />
                    <span className='span-color'>Local</span>
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
                    {/* Botão para adicionar região, aparece se não estiver visível */}
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

                  {/* Lista de sugestões para autocomplete de local */}
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

                {/* Campo Região que aparece condicionalmente */}
                {showRegionInput && (
                  <label className="forms-label">
                    <div className="create-profile-icon">
                      <MdAddLocationAlt className="icon-profile" />
                      <span className='span-color'>Região</span>
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

                {/* Campo Categoria com select */}
                <label className="forms-label">
                  <div className="create-profile-icon">
                    <FaCoffee className="icon-profile" />
                    <span className='span-color'>Categoria</span>
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

                {/* Upload da imagem arquivo1 */}
                <label className="forms-label">
                  <div className="create-profile-icon">
                    <FaRegImage className="icon-profile" />
                    <span className='span-color'>Arquivo</span>
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
                    {/* Mostra preview da imagem ou ícone de upload */}
                    {imagePreview1 ? (
                      <img src={imagePreview1} alt="Preview 1" className="image-preview-inside-button" />
                    ) : (
                      <FiUpload className='upload-icon-edit-2' />
                    )}
                  </button>
                  {errors.arquivo1 && <span className="forms-span">Campo obrigatório</span>}
                </label>

                {/* Botão para enviar o formulário */}
                <button type="submit" className="forms-button">Enviar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
