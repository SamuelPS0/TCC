import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function CreatePerfil() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  // Conversão de arquivos para Base64
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

  const onSubmit = (data) => {
    // Monta objeto Prestador com todos os campos esperados pelo backend
const prestador = {
  nome: data.nome || "",
  dataNascimento: data.dataNascimento ? data.dataNascimento + "T00:00:00" : null,
  cpf: data.cpf || "",
  genero: data.genero || "",
  telefone: data.telefone || "",
  logradouro: data.logradouro || "",
  numeroResidencial: data.numeroResidencial || "",
  complemento: data.complemento || "",
  cep: data.cep || "",
  bairro: data.bairro || "",
  cidade: data.cidade || "",
  uf: data.uf || "",
  statusPrestador: data.statusPrestador === "true" || true, // envia boolean
  categoria: data.categoria || "",
  imagem1: image1 || "",
  imagem2: image2 || ""
};


    axios.post('http://localhost:8080/api/v1/prestador', prestador)
      .then(res => {
        console.log("Prestador criado:", res.data);
        alert("Perfil criado com sucesso!");
      })
      .catch(err => {
        console.error("Erro ao criar prestador:", err);
        alert("Erro ao criar perfil");
      });
  };

  return (
    <div>
      <h1>Criar Perfil Completo</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nome:</label>
          <input {...register("nome", { required: true })} />
          {errors.nome && <span>Campo obrigatório</span>}
        </div>

        <div>
          <label>Data de Nascimento:</label>
          <input type="date" {...register("dataNascimento")} />
        </div>

        <div>
          <label>CPF:</label>
          <input {...register("cpf")} placeholder="000.000.000-00" />
        </div>

        <div>
          <label>Gênero:</label>
          <select {...register("genero")}>
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div>
          <label>Telefone:</label>
          <input {...register("telefone")} placeholder="(00) 00000-0000" />
        </div>

        <div>
          <label>Logradouro:</label>
          <input {...register("logradouro")} />
        </div>

        <div>
          <label>Número Residencial:</label>
          <input {...register("numeroResidencial")} />
        </div>

        <div>
          <label>Complemento:</label>
          <input {...register("complemento")} />
        </div>

        <div>
          <label>CEP:</label>
          <input {...register("cep")} placeholder="00000-000" />
        </div>

        <div>
          <label>Bairro:</label>
          <input {...register("bairro")} />
        </div>

        <div>
          <label>Cidade:</label>
          <input {...register("cidade")} />
        </div>

        <div>
          <label>UF:</label>
          <input {...register("uf")} placeholder="SP" maxLength={2} />
        </div>

        <div>
          <label>Status:</label>
          <select {...register("statusPrestador")}>
            <option value={true}>Ativo</option>
            <option value={false}>Inativo</option>
          </select>
        </div>

        <div>
          <label>Categoria:</label>
          <select {...register("categoria")}>
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

        <div>
          <label>Imagem 1:</label>
          <input type="file" accept="image/*" onChange={handleFile1} />
        </div>

        <div>
          <label>Imagem 2:</label>
          <input type="file" accept="image/*" onChange={handleFile2} />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
