import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Components/AuthContext';
import axios from 'axios';

const CreatePerfil = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dados do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [genero, setGenero] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [categoriaId, setCategoriaId] = useState(1); // exemplo fixo
  const [nomeServico, setNomeServico] = useState('');
  const [imagem1, setImagem1] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert('Usuário não está logado.');
      return;
    }

    try {
      // 1️⃣ Cadastrar prestador
      const prestadorData = {
        usuario_id: user.id,
        nome,
        cpf,
        genero,
        telefone,
        logradouro,
        numero_residencial: numero,
        complemento,
        cep,
        bairro,
        cidade,
        uf,
        status_prestador: 'ATIVO'
      };

      const prestadorRes = await axios.post('http://localhost:8080/api/v1/prestador', prestadorData);
      const prestadorId = prestadorRes.data.id;

      // 2️⃣ Cadastrar serviço vinculado ao prestador
      const servicoData = {
        categoria_id: categoriaId,
        prestador_id: prestadorId,
        nome: nomeServico,
        status_servico: 'ATIVO',
        foto: imagem1 // pode ser base64 ou null
      };

      await axios.post('http://localhost:8080/api/v1/servico', servicoData);

      alert('Perfil criado com sucesso!');
      navigate('/home-list');
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      alert('Falha ao criar o perfil.');
    }
  };

  return (
    <div className="create-perfil">
      <h1>Criar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        <input placeholder="Gênero" value={genero} onChange={(e) => setGenero(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input placeholder="Logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
        <input placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
        <input placeholder="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
        <input placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
        <input placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
        <input placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
        <input placeholder="UF" value={uf} onChange={(e) => setUf(e.target.value)} />
        <input placeholder="Nome do Serviço" value={nomeServico} onChange={(e) => setNomeServico(e.target.value)} />
        <button type="submit">Criar Perfil</button>
      </form>
    </div>
  );
};

export default CreatePerfil;
