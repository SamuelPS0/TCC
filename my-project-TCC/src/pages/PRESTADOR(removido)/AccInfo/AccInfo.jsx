import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import para navegar entre rotas
import "./AccInfo.css"; 
import SideMenu from "../../Components/SideMenu/SideMenu";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaBirthdayCake,
  FaVenusMars,
  FaMapMarkedAlt,
} from "react-icons/fa"; // Ícones usados nos inputs do formulário

export default function AccInfo() {
  // Estado que guarda os valores do formulário
  const [formData, setFormData] = useState({
    nome: "",
    telefoneDDD: "",
    telefone: "",
    email: "",
    senha: "",
    datanascimento: "",
    genero: "",
    estado: "",
  });

  // Estado para controlar se a senha está visível ou não
  const [showPassword, setShowPassword] = useState(false);

  // Hook para navegação entre rotas
  const navigate = useNavigate();

  // Função para atualizar o estado conforme o usuário digita nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Alterna a visibilidade da senha (mostrar/ocultar)
  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  // Função chamada quando o formulário é enviado
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    console.log("Dados enviados:", formData); // Aqui pode salvar os dados (localStorage)

    navigate("/"); // Navega para a rota inicial após enviar
  };

  return (
    <div className="accinfo-background-accinfo">
      {/* Cabeçalho do formulário */}
      <div className="header-wrapper-accinfo">
        <h1 className="form-title-accinfo">INFORMAÇÕES DA CONTA</h1>
        <p className="form-subtitle-accinfo">
          Apenas você tem acesso a estas informações pessoais.
        </p>
      </div>

      <div className="accinfo-wrapper-accinfo">
        <SideMenu /> {/* Menu lateral fixo */}

        {/* Formulário com inputs controlados */}
        <form
          className="input-accinfo-wrapper-accinfo"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Input para nome */}
          <div className="input-block-accinfo">
            <label htmlFor="nome" className="input-label-accinfo">
              <FaUser className="input-icon-accinfo" /> <span>Nome</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Digite seu nome"
              value={formData.nome}
              onChange={handleChange}
              className="input-text-accinfo"
            />
          </div>

          {/* Grupo de inputs para telefone (DDD e número) */}
          <div className="input-block-accinfo telefone-ddd-group-accinfo">
            <div className="input-group-accinfo ddd-group-accinfo">
              <label htmlFor="telefoneDDD" className="input-label-accinfo">
                <FaPhone className="input-icon-accinfo" /> <span>Telefone</span>
              </label>
              <input
                type="text"
                id="telefoneDDD"
                name="telefoneDDD"
                placeholder="DDD"
                maxLength={3}
                value={formData.telefoneDDD}
                onChange={handleChange}
                className="input-text-accinfo input-ddd-accinfo"
              />
            </div>

            <div className="input-group-accinfo telefone-group-accinfo">
              {/* Label invisível só para manter alinhamento */}
              <label htmlFor="telefone" className="input-label-accinfo">
                <span className="invisible-accinfo">.</span>
              </label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                placeholder="Digite seu telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="input-text-accinfo input-telefone-accinfo"
              />
            </div>
          </div>

          {/* Input para email */}
          <div className="input-block-accinfo">
            <label htmlFor="email" className="input-label-accinfo">
              <FaEnvelope className="input-icon-accinfo" /> <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              className="input-text-accinfo"
            />
          </div>

          {/* Input para senha com botão para mostrar/ocultar */}
          <div className="input-block-accinfo password-block-accinfo">
            <label htmlFor="senha" className="input-label-accinfo">
              <FaLock className="input-icon-accinfo" /> <span>Senha</span>
            </label>
            <div className="password-wrapper-accinfo">
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                name="senha"
                placeholder="Crie uma senha"
                value={formData.senha}
                onChange={handleChange}
                className="input-text-accinfo input-password-accinfo"
              />
              {/* Ícone para alternar visibilidade da senha */}
              <span
                className="password-toggle-icon-accinfo"
                onClick={togglePasswordVisibility}
                role="button"
                tabIndex={0}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") togglePasswordVisibility();
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Inputs para data de nascimento e gênero lado a lado */}
          <div className="input-block-accinfo data-genero-group-accinfo">
            <div className="input-group-accinfo data-group-accinfo">
              <label htmlFor="datanascimento" className="input-label-accinfo">
                <FaBirthdayCake className="input-icon-accinfo" /> <span>Data de Nascimento</span>
              </label>
              <input
                type="date"
                id="datanascimento"
                name="datanascimento"
                value={formData.datanascimento}
                onChange={handleChange}
                className="input-text-accinfo"
              />
            </div>

            <div className="input-group-accinfo genero-group-accinfo">
              <label htmlFor="genero" className="input-label-accinfo">
                <FaVenusMars className="input-icon-accinfo" /> <span>Gênero</span>
              </label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="input-select-accinfo"
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
                <option value="Prefiro não dizer">Prefiro não dizer</option>
              </select>
            </div>
          </div>

          {/* Select para estado */}
          <div className="input-block-accinfo">
            <label htmlFor="estado" className="input-label-accinfo">
              <FaMapMarkedAlt className="input-icon-accinfo" /> <span>Estado</span>
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="input-select-accinfo"
            >
              <option value="">Selecione</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>

          {/* Botão para enviar o formulário */}
          <div className="input-block-accinfo">
            <button type="submit" className="forms-button-accinfo">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
