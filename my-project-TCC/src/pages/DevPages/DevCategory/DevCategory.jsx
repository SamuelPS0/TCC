import React, { useEffect, useState } from 'react';
import AdmCategoryComponent from '../../../Components/ADM/AdmCategoryComponent/AdmCategoryComponent';
import HeaderSwitcher from '../../../Components/HeaderSwitcher';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './DevCategory.css';

const DevCategory = () => {
  const [categorias, setCategorias] = useState([]);  // Estado para lista de categorias

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Função para carregar categorias do backend
  const carregarCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/categoria");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  // Função para criar nova categoria
  const aoEnviar = async (postdata) => {
    try {
      await axios.post("http://localhost:8080/api/v1/categoria", {
        nome: postdata.name,
        status_categoria: "1"
      });
      alert(`A categoria ${postdata.name} foi criada com sucesso!`)
      reset(); 
      carregarCategorias(); // Atualiza lista ao criar categoria
    } catch (error) {
      console.error("Erro ao cadastrar:", error.response?.data || error.message);
      alert("Houve um erro ao registrar a categoria, tente novamente.");
    }
  };

  // Carrega categorias ao montar o componente
  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <div>
      <HeaderSwitcher />
      <div>
   <AdmCategoryComponent categorias={categorias} />
        <form onSubmit={handleSubmit(aoEnviar)} className='devc-form'>
          <input  className='devc-input'
            type="text"
            placeholder="Digite a categoria..."
            {...register('name', { required: true })}     
          />
          <button type="submit" className='devc-submit'>Adicionar categoria</button>

          
        </form>
      </div>
    </div>
  );
};

export default DevCategory;
