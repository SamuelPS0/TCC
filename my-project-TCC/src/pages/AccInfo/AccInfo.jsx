import React, { useState } from 'react';
import './AccInfo.css';
import SideMenu from '../../Components/SideMenu/SideMenu';
import Input from '../../Components/Input/Input';

export default function AccInfo() {
  const [formData, setFormData] = useState({
    nome: '',
    telefoneDDD: '',
    telefone: '',
    email: '',
    senha: '',
    datanascimento: '',
    genero: '',
    estado: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para um backend, por exemplo
    console.log('Dados do formulário:', formData);
    alert('Formulário enviado! Veja os dados no console.');
  };

  return (
    <div className='accinfo-background'>
      <div className='accinfo-container'>
        <SideMenu />

        <form className="input-accinfo-wrapper" onSubmit={handleSubmit}>
          <Input
            name="Nome"
            inputName="nome"
            placeholder="Digite seu nome"
            value={formData.nome}
            onChange={handleChange}
          />
          <div className="close-input-wrapper">
            <Input
              name="DDD"
              inputName="telefoneDDD"
              placeholder="Ex: 11"
              value={formData.telefoneDDD}
              onChange={handleChange}
            />

            <Input
              name="Telefone"
              inputName="telefone"
              placeholder="Digite seu telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>

          <Input
            name="Email"
            inputName="email"
            placeholder="Digite seu email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            name="Senha"
            inputName="senha"
            placeholder="Crie uma senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
          />
          <div className="close-input-wrapper">
            <Input
              name="Data de Nascimento"
              inputName="datanascimento"
              type="date"
              placeholder="dd/mm/aaaa"
              value={formData.datanascimento}
              onChange={handleChange}
            />

            <div className='select-wrapper'>
              <p>Gênero</p>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
                <option value="Prefiro não dizer">Prefiro não dizer</option>
              </select>
            </div>
          </div>

          <div className='select-wrapper'>
            <p>Estado</p>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
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

          <button type="submit" className="forms-button">Enviar</button>
        </form>
      </div>
    </div>
  );
}
