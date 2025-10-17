import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdmUserComponent.css';
import axios from 'axios';
import {toast} from 'sonner'
import { FaEye } from "react-icons/fa";

const AdmUserComponent = ({termoBusca }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate();

  // Carrega usuários da API
  const carregarUsuarios = async () => {
    try {
      const resposta = await axios.get(`http://localhost:8080/api/v1/Usuario`);
      setUsuarios(resposta.data);
      setUsuariosFiltrados(resposta.data);
    } catch (error) {
      toast.warning('Falha ao carregar usuários');
      console.log("Erro ao carregar usuários:", error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Alterna abertura dos dropdowns
  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Filtragem e ordenação
  const aplicarFiltro = (tipo, valor) => {
    let lista = [...usuarios];

    if (tipo === 'ordem') {
      if (valor === 'A-Z') lista.sort((a, b) => a.nome.localeCompare(b.nome));
      if (valor === 'Z-A') lista.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    if (tipo === 'nivel') {
      lista = lista.filter((u) => u.nivelAcesso === valor);
    }

    if (tipo === 'status') {
      if (valor === 'ATIVO') lista = lista.filter((u) => u.statusUsuario === true);
      if (valor === 'INATIVO') lista = lista.filter((u) => u.statusUsuario === false);
      if (valor === 'EM ANÁLISE') lista = lista.filter((u) => u.statusUsuario === null);
    }

    setUsuariosFiltrados(lista);
    setOpenDropdown(null);
  };

  // Resetar filtros
  const limparFiltros = () => {
    setUsuariosFiltrados(usuarios);
  };

  // Redirecionamento
  const handleVisualizar = (usuario) => {
    if (usuario.nivelAcesso === "ADMIN") {
      navigate('/dev-view-adm', { state: { usuario } });
    } else if (usuario.nivelAcesso === "PRESTADOR") {
      navigate('/dev-view-prestador', { state: { usuario } });
    } else if (usuario.nivelAcesso === "CLIENTE") {
      navigate('/dev-view-client', { state: { usuario } });
    }
  };

    useEffect(() => {
    if (termoBusca.trim() === "") {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtrados = usuarios.filter((u) =>
        u.nome.toLowerCase().includes(termoBusca.toLowerCase())
      );
      setUsuariosFiltrados(filtrados);
    }
  }, [termoBusca, usuarios]);

  return (
    <>
    {/* ====== Dropdowns ====== */}
      <div className="auc-dropdown-bar">
        {/* ORDEM */}
        <div className="auc-dropdown">
          <button onClick={() => toggleDropdown('ordem')} className="auc-ordem">ORDEM</button>
          {openDropdown === 'ordem' && (
            <div className="auc-menu">
              <div onClick={() => aplicarFiltro('ordem', 'A-Z')}>A - Z</div>
              <div onClick={() => aplicarFiltro('ordem', 'Z-A')}>Z - A</div>
            </div>
          )}
        </div>

        {/* NÍVEL DE ACESSO */}
        <div className="auc-dropdown">
          <button onClick={() => toggleDropdown('nivel')} className="auc-status">NÍVEL DE ACESSO</button>
          {openDropdown === 'nivel' && (
            <div className="auc-menu">
              <div onClick={() => aplicarFiltro('nivel', 'ADMIN')}>ADMIN</div>
              <div onClick={() => aplicarFiltro('nivel', 'PRESTADOR')}>PRESTADOR</div>
              <div onClick={() => aplicarFiltro('nivel', 'CLIENTE')}>CLIENTE</div>
            </div>
          )}
        </div>

        {/* STATUS */}
        <div className="auc-dropdown">
          <button onClick={() => toggleDropdown('status')} className="auc-btn">STATUS</button>
          {openDropdown === 'status' && (
            <div className="auc-menu">
              <div onClick={() => aplicarFiltro('status', 'ATIVO')}>ATIVO</div>
              <div onClick={() => aplicarFiltro('status', 'INATIVO')}>INATIVO</div>
              <div onClick={() => aplicarFiltro('status', 'EM ANÁLISE')}>EM ANÁLISE</div>
            </div>
          )}
        </div>

      </div>
        <button onClick={limparFiltros} className="auc-clear">LIMPAR</button>

      {/* ====== TABELA ====== */}
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

        {usuariosFiltrados.map((usuario, index) => (
          <div className="auc-row" key={usuario.id || index}>
            <div className="auc-col id">{usuario.id}</div>
            <div className="auc-col nome">{usuario.nome}</div>
            <div className="auc-col email">{usuario.email}</div>
            <div className="auc-col nivel">{usuario.nivelAcesso}</div>
            <div className={`auc-col status ${usuario.statusUsuario ? "ativo" : "inativo"}`}>
              {usuario.statusUsuario === null
                ? "Em análise"
                : usuario.statusUsuario
                ? "Ativo"
                : "Inativo"}
            </div>
            <div className="auc-col acoes">
              <button
                className="btn-visualizar"
                onClick={() => handleVisualizar(usuario)}>
                <FaEye /> Visualizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AdmUserComponent;
