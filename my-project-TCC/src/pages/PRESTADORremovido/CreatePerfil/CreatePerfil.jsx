import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function CreatePerfil() {
  // States para armazenar as imagens
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  // Formulário de Cadastro do Prestador
  const { register: registerPrestador, handleSubmit: handleSubmitPrestador, formState: { errors: errorsPrestador } } = useForm();
  
  // Formulário de Perfil do Prestador
  const { register: registerPerfil, handleSubmit: handleSubmitPerfil, formState: { errors: errorsPerfil } } = useForm();

  // Conversão de arquivos para Base64 para o perfil
  const handleFile1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage1(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFile2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage2(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Função para envio do Formulário 1 (Cadastro do Prestador)
  const onSubmitPrestador = (data) => {
    const cadastroPrestador = {
      nome: data.nome || "",
      telefone: data.telefone || "",
      cpf: data.cpf || "",
      email: data.email || "",
      senha: data.senha || "",
      datanascimento: data.dataNascimento || "",
      genero: data.genero || "",
      estado: data.estado || "",
    };

    axios.post('http://localhost:8080/api/v1/prestador', cadastroPrestador)
      .then(res => {
        console.log("Prestador criado:", res.data);
        alert("Prestador criado com sucesso!");
      })
      .catch(err => {
        console.error("Erro ao criar prestador:", err);
        alert("Erro ao criar prestador");
      });
  };

  // Função para envio do Formulário 2 (Perfil do Prestador)
  const onSubmitPerfil = (dataPerfil) => {
    const perfilPrestador = {
      arquivo: image1 || "", // Se o arquivo1 estiver disponível, usa ele
      nome: dataPerfil.nome || "",
      descricao: dataPerfil.descricao || "",
      contato: dataPerfil.contato || "",
      local: dataPerfil.local || "",
      regiao: dataPerfil.regiao || "",
      categoria: dataPerfil.categoria || "",
      arquivo2: image2 || "", // Se o arquivo2 estiver disponível, usa ele
    };

    axios.post('http://localhost:8080/api/v1/perfil', perfilPrestador)
      .then(res => {
        console.log("Perfil Prestador criado:", res.data);
        alert("Perfil criado com sucesso!");
      })
      .catch(err => {
        console.error("Erro ao criar perfil:", err);
        alert("Erro ao criar perfil");
      });
  };

  return (
    <div>
      <h1>Criar Perfil Completo</h1>

      {/* Formulário 1: Cadastro do Prestador */}
      <h2>Cadastro do Prestador</h2>
      <form onSubmit={handleSubmitPrestador(onSubmitPrestador)}>
        {/* Nome */}
        <div>
          <label>Nome:</label>
          <input {...registerPrestador("nome", { required: "Campo obrigatório" })} />
          {errorsPrestador.nome && <span>{errorsPrestador.nome.message}</span>}
        </div>

        {/* Telefone */}
        <div>
          <label>Telefone:</label>
          <input {...registerPrestador("telefone")} placeholder="(00) 00000-0000" />
        </div>

        {/* CPF */}
        <div>
          <label>CPF:</label>
          <input {...registerPrestador("cpf")} placeholder="000.000.000-00" />
        </div>

        {/* Email */}
        <div>
          <label>Email:</label>
          <input type="email" {...registerPrestador("email")} />
        </div>

        {/* Senha */}
        <div>
          <label>Senha:</label>
          <input type="password" {...registerPrestador("senha")} />
        </div>

        {/* Data de Nascimento */}
        <div>
          <label>Data de Nascimento:</label>
          <input type="date" {...registerPrestador("dataNascimento")} />
        </div>

        {/* Gênero */}
        <div>
          <label>Gênero:</label>
          <select {...registerPrestador("genero")}>
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label>Estado:</label>
          <input {...registerPrestador("estado")} placeholder="SP" maxLength={2} />
        </div>

        {/* Botão de envio */}
        <button type="submit">Enviar Cadastro</button>
      </form>







      {/* Formulário 2: Perfil do Prestador */}
      <h2>Perfil do Prestador</h2>
      <form onSubmit={handleSubmitPerfil(onSubmitPerfil)}>
        
        {/* Arquivo 1 */}
        <div>
          <label>Arquivo 1:</label>
          <input type="file" accept="image/*" onChange={handleFile1} />
        </div>
        
        <div>
          <label>Nome:</label>
          <input {...registerPerfil("nome")} placeholder="Nome" />
        </div>
        {/* Descrição */}
        <div>
          <label>Descrição:</label>
          <textarea {...registerPerfil("descricao")} />
        </div>

        {/* Contato */}
        <div>
          <label>Contato:</label>
          <input {...registerPerfil("contato")} placeholder="(00) 00000-0000" />
        </div>

        {/* Local */}
        <div>
          <label>Local:</label>
          <input {...registerPerfil("local")} />
        </div>

        {/* Região */}
        <div>
          <label>Região:</label>
          <input {...registerPerfil("regiao")} />
        </div>

        {/* Categoria */}
        <div>
          <label>Categoria:</label>
          <select {...registerPerfil("categoria")}>
            <option value="">Selecione</option>
            <option value="Comidas Prontas">Comidas Prontas</option>
            <option value="Lanches e Fast Food">Lanches e Fast Food</option>
            <option value="Doces e Sobremesas">Doces e Sobremesas</option>
            <option value="Padaria e Confeitaria">Padaria e Confeitaria</option>
            <option value="Sucos naturais">Sucos naturais</option>
            <option value="Drinks artesanais">Drinks artesanais</option>
            <option value="Cafés e chás especiais">Cafés e chás especiais</option>
            <option value="Saudável e Fitness">Saudável e Fitness</option>
          </select>
        </div>


        {/* Arquivo 2 */}
        <div>
          <label>Arquivo 2:</label>
          <input type="file" accept="image/*" onChange={handleFile2} />
        </div>

        {/* Botão de envio */}
        <button type="submit">Enviar Perfil</button>
      </form>
    </div>
  );
}
