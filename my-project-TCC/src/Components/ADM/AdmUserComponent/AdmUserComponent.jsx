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
  const [statusPrestadorPorUsuarioId, setStatusPrestadorPorUsuarioId] = useState({});
  const navigate = useNavigate();
  
    const normalizeStatus = (status, fallback = "") =>
    String(status ?? fallback).trim().toUpperCase();

  const getStatusExibicao = (usuario) => {
    if (usuario.nivelAcesso === "PRESTADOR") {
      const statusPrestador = normalizeStatus(
        statusPrestadorPorUsuarioId[Number(usuario.id)],
        ""
      );

      if (statusPrestador === "EM_ANALISE") return "EM_ANALISE";
      if (statusPrestador === "INATIVO") return "INATIVO";
      if (statusPrestador === "ATIVO") return "ATIVO";
    }

    if (usuario.statusUsuario === null) return "EM_ANALISE";
    return usuario.statusUsuario ? "ATIVO" : "INATIVO";
  };

  // Carrega usuários da API
  const carregarUsuarios = async () => {
    toast.success('Usuários carregados')
    try {
      const [respostaUsuarios, respostaPrestadores] = await Promise.all([
        axios.get(`http://localhost:8080/api/v1/Usuario`),
        axios.get(`http://localhost:8080/api/v1/prestador`),
      ]);

      const usuariosData = respostaUsuarios.data || [];
      const prestadoresData = respostaPrestadores.data || [];

      const statusPorUsuario = prestadoresData.reduce((acc, prestador) => {
        const usuarioId = Number(prestador?.usuario?.id ?? prestador?.usuario_id);

        if (!Number.isNaN(usuarioId) && usuarioId > 0) {
          acc[usuarioId] = normalizeStatus(prestador.statusPrestador, "EM_ANALISE");
        }

        return acc;
      }, {});

      setStatusPrestadorPorUsuarioId(statusPorUsuario);
      setUsuarios(usuariosData);
      setUsuariosFiltrados(usuariosData);
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
          if (valor === 'ATIVO') lista = lista.filter((u) => getStatusExibicao(u) === 'ATIVO');
      if (valor === 'INATIVO') lista = lista.filter((u) => getStatusExibicao(u) === 'INATIVO');
      if (valor === 'EM ANÁLISE') lista = lista.filter((u) => getStatusExibicao(u) === 'EM_ANALISE');
    }
    setUsuariosFiltrados(lista);
    setOpenDropdown(null);
  };

  // Resetar filtros
  const limparFiltros = () => {
    setUsuariosFiltrados(usuarios);
  };

  // Redirecionamento
const handleVisualizar = async (usuario) => {
  if (usuario.nivelAcesso === "ADMIN") {
    navigate('/dev-view-adm', { state: { usuario } });
  } else if (usuario.nivelAcesso === "PRESTADOR") {
    try {
      // Busca todos os prestadores e encontra o vinculado ao usuário
      const res = await axios.get("http://localhost:8080/api/v1/prestador");
      const prestador = res.data.find(
        (p) => p.usuario && Number(p.usuario.id) === Number(usuario.id)
      );

      if (prestador) {
        navigate(`/dev-view-prestador/${prestador.id}`);
      } else {
        toast.warning("Prestador vinculado não encontrado para este usuário.");
      }
    } catch (err) {
      toast.error("Erro ao buscar prestador vinculado.");
      console.error(err);
    }
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
            <div
              className={`auc-col status ${
                getStatusExibicao(usuario) === "ATIVO" ? "ativo" : "inativo"
              }`}
            >
              {getStatusExibicao(usuario) === "EM_ANALISE"
                ? "Em análise"
                : getStatusExibicao(usuario) === "ATIVO"
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
