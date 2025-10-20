import React, { useEffect, useState } from 'react';
import AdmCategoryComponent from '../../../Components/ADM/AdmCategoryComponent/AdmCategoryComponent';
import HeaderSwitcher from '../../../Components/HeaderSwitcher';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {toast} from 'sonner'
import './DevCategory.css';

const DevCategory = () => {
  const [categorias, setCategorias] = useState([]);
  const [editarCategorias, setEditarCategorias] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();



  // FUNÇÃO GET (Read)
const carregarCategorias = async () => {
  const toastId = toast.loading('Carregando categorias');
  try {
    const response = await axios.get("http://localhost:8080/api/v1/categoria");
    setCategorias(response.data);
    console.log('Categorias carregadas:', response.data);
    toast.success('Categorias carregadas com sucesso!', { id: toastId });
  } catch (error) {
    toast.error("Erro ao carregar categorias:", error, { id: toastId });
    console.error("Erro ao carregar categorias:", error);
  }
};


    useEffect(() => {
    carregarCategorias();
  }, []);

  //FUNÇÃO PUT (Update)
  const atualizarNomeCategoria = async (id, novoNome) => {
  try {
    await axios.put(`http://localhost:8080/api/v1/categoria/${id}`, {
      nome: novoNome,
      status_categoria: "ATIVO"
    });
    toast.success("Categoria atualizada com sucesso!");
    carregarCategorias();
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error.response?.data || error.message);
    toast.error("Houve um erro ao atualizar a categoria, tente novamente.");
  }
};


  const confirmarEdicao = async (categoria) => {
  if (!novoNome.trim() || novoNome === categoria.nome) {
    cancelarEdicao();
    return;
  }

  try {
    setEnviando(true);
    console.log('Atualizando categoria:', categoria.id, 'Novo nome:', novoNome);
    await onUpdate(categoria.id, novoNome);  // Atualiza no backend
    cancelarEdicao(); // Fecha modo de edição
  } catch (error) {
    toast.error("Erro ao atualizar.");
    console.error(error);
    setEnviando(false);
  }
};

  // FUNÇÃO POST (Create)
  const criarCategoria = async (postdata) => {
    try {
      await axios.post("http://localhost:8080/api/v1/categoria", {
        nome: postdata.name,
        status_categoria: "ATIVO"
      });
      toast.success(`A categoria ${postdata.name} foi criada com sucesso!`);
      reset();
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao cadastrar:", error.response?.data || error.message);
      toast.errror("Houve um erro ao registrar a categoria, tente novamente.");
    }
  };

  // Atualizar categoria
  const atualizarCategoria = async (postdata) => {
    try {
      await axios.put(`http://localhost:8080/api/v1/categoria/${editarCategorias.id}`, {
        nome: postdata.name,
        status_categoria: "ATIVO"
      });
      toast.success(`Categoria atualizada com sucesso!`);
      reset();
      carregarCategorias();
      setEditarCategorias(null);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error.response?.data || error.message);
      toast.error("Houve um erro ao atualizar a categoria, tente novamente.");
    }
  };

  // Enviar formulário (criar ou atualizar)
  const aoEnviar = async (postdata) => {
    if (editarCategorias) {
      await atualizarCategoria(postdata);
    } else {
      await criarCategoria(postdata);
    }
  };
// DELETE DO CRUD
const deleteCategoria = async (id) => {
  try {
    if (window.confirm("Deseja realmente excluir esta categoria?")) {
      await axios.delete(`http://localhost:8080/api/v1/categoria/${id}`);
      toast.error("Categoria deletada com sucesso!");
      carregarCategorias(); // Atualiza a lista
    }
  } catch (error) {
    console.error("Erro ao deletar categoria:", error.response?.data || error.message);
    toast.error("Erro ao deletar categoria, tente novamente.");
  }
};
  


  return (
    <div>
      <HeaderSwitcher />
      <div>
        <AdmCategoryComponent 
  categorias={categorias} 
  onUpdate={atualizarNomeCategoria} 
  onDelete={deleteCategoria}
/>


        <form onSubmit={handleSubmit(aoEnviar)} className='devc-form'>
          <input
          className={`devc-input ${editarCategorias ? 'devc-input-editando' : ''}`}
          type="text"
          placeholder="Digite a categoria..."
          {...register('name', { required: true })}
          onBlur={() => setEditarCategorias(null)}
        />


          <button type="submit" className='devc-submit'>
            {editarCategorias ? "Salvar alteração" : "Adicionar categoria"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DevCategory;
