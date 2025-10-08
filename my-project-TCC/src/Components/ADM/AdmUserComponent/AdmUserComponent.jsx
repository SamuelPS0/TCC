import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdmUserComponent.css';
import axios from 'axios';
import { FaEye } from "react-icons/fa";

const AdmUserComponent = () => {
  const [usuarios, setUsuarios] = useState([]);

  const carregarUsuarios = async () => {
    try {
      const resposta = await axios.get(`http://localhost:8080/api/v1/Usuario`);
      setUsuarios(resposta.data);
      console.log('Usuarios atualizados:', resposta.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const navigate = useNavigate();

const handleVisualizar = (usuario) => {
  navigate('/dev-view', { state: { usuario } });
};


  return (
    <div className="auc-container">
      <div className="auc-table">
        <div className="auc-header">
          <div className="auc-col id">ID</div>
          <div className="auc-col nome">Nome</div>
          <div className="auc-col email">Email</div>
          <div className="auc-col nivel">Nível de acesso</div>
          <div className="auc-col status">Status</div>
          <div className="auc-col acoes">Ações</div>
        </div>

        {usuarios.map((usuario, index) => (
          <div className="auc-row" key={usuario.id || index}>
            <div className="auc-col id">{usuario.id}</div>
            <div className="auc-col nome">{usuario.nome}</div>
            <div className="auc-col email">{usuario.email}</div>
            <div className="auc-col nivel">{usuario.nivelAcesso}</div>
            <div className={`auc-col status ${usuario.statusUsuario ? "ativo" : "inativo"}`}>
              {usuario.statusUsuario ? "Ativo" : "Inativo"}
              </div>
            <div className="auc-col acoes">
              <button
                className="btn-visualizar"
                onClick={() => handleVisualizar(usuario)}
              >
                <FaEye /> Visualizar
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmUserComponent;
