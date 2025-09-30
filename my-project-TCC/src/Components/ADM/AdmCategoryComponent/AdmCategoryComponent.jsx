import React, { useState } from 'react';
import './AdmCategoryComponent.css';
import { MdDeleteForever, MdModeEditOutline, MdCheck, MdClose } from "react-icons/md";

const AdmCategoryComponent = ({ categorias, onUpdate, onDelete }) => {
  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [enviando, setEnviando] = useState(false); 

  const iniciarEdicao = (categoria) => {
    setEditandoId(categoria.id);
    setNovoNome(categoria.nome);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNovoNome('');
    setEnviando(false);
  };

  const confirmarEdicao = async (categoria) => {
    if (!novoNome.trim() || novoNome === categoria.nome) {
      cancelarEdicao();
      return;
    }

    try {
      setEnviando(true);
      await onUpdate(categoria.id, novoNome);
      cancelarEdicao();                      
    } catch (error) {
      alert("Erro ao atualizar.");
      console.error(error);
      setEnviando(false);
    }
  };

  const confirmarDelete = (categoria) => {
    if (window.confirm(`Deseja realmente excluir a categoria "${categoria.nome}"?`)) {
      onDelete(categoria.id);
    }
  };

  return (
    <div className='adm-category-body'>
      <table className="adm-category-table">
        <tbody>
          {categorias.map((categoria) => (
            <tr className='adm-category-item' key={categoria.id}>
              <td>
                {editandoId === categoria.id ? (
                  <input
                    className='adm-category-edit-input'
                    type="text"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmarEdicao(categoria);
                      if (e.key === 'Escape') cancelarEdicao();
                    }}
                    autoFocus
                  />
                ) : (
                  categoria.nome
                )}
              </td>

              <td className='adm-category-actions'>
                {editandoId === categoria.id ? (
                  <>
                    <button
                      className='adm-category-button edit-button'
                      onClick={() => confirmarEdicao(categoria)}
                      disabled={enviando}
                    >
                      {enviando ? "Enviando..." : <MdCheck className='adm-category-icon' />}
                    </button>
                    <button
                      className='adm-category-button cancel-button'
                      onClick={cancelarEdicao}
                      disabled={enviando}
                    >
                      <MdClose className='adm-category-icon' />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className='adm-category-button edit-button' 
                      onClick={() => iniciarEdicao(categoria)}
                    >
                      <MdModeEditOutline className='adm-category-icon' />
                    </button>
                    <button 
                      className='adm-category-button delete-button' 
                      onClick={() => confirmarDelete(categoria)}
                    >
                      <MdDeleteForever className='adm-category-icon' />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdmCategoryComponent;
