import React, { useState, useEffect } from 'react';
import './AdmUserComponent.css';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const AdmUserComponent = () => {
  const [usuarios, setUsuarios] = useState([]);

  const carregarUsuarios = async () => {
    try {
      const resposta = await axios.get(`http://localhost:8080/api/v1/Usuario`);
      setUsuarios(resposta.data);
      console.log('Usuarios atualizados:', resposta.data);
    } catch (error) {
      console.error("Erro ao carregar usuarios:", error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <div className='auc-wrapper'>
      <Table striped="columns">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Senha</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={usuario.id || index}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.nivelAcesso}</td>
              <td>{usuario.statusUsuario ? "Ativo" : "Inativo"}</td>
              <td>
                <button><FaEye />Visualizar</button>
                <button><MdEdit />Editar</button>
                <button><FaTrash />Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdmUserComponent;
