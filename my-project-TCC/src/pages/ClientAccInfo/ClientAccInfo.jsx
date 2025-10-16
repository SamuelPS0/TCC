import React, { useState, useEffect } from 'react';
import SideMenuCLIENT from '../../Components/SideMenu/SideMenuCLIENT/SideMenuCLIENT';
import { useAuth } from '../../Components/AuthContext';
import {toast} from 'sonner'
import axios from 'axios';
import './ClientAccInfo.css';

function ClientAccInfo() {
  const { user } = useAuth(); // usuário logado
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [originalData, setOriginalData] = useState({}); // Para comparar se houve alterações
  const [loading, setLoading] = useState(false);

  // Buscar dados do usuário
  useEffect(() => {
    if (user?.email) {
      axios.get('http://localhost:8080/api/v1/Usuario')
        .then((response) => {
          const usuarios = response.data;
          const usuarioLogado = usuarios.find(u => u.email === user.email);
          if (usuarioLogado) {
            setFormData({
              nome: usuarioLogado.nome || '',
              email: usuarioLogado.email || '',
              senha: usuarioLogado.senha || ''
            });
            setOriginalData({
              nome: usuarioLogado.nome || '',
              email: usuarioLogado.email || '',
              senha: usuarioLogado.senha || ''
            });
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar dados do usuário:', error);
          toast.error('Não foi possível carregar suas informações.');
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (
      formData.nome === originalData.nome &&
      formData.email === originalData.email &&
      formData.senha === originalData.senha
    ) {
      toast.warning('Nenhuma alteração detectada.');
      return;
    }

    try {
      setLoading(true);

      // Buscar ID do usuário para atualizar
      const response = await axios.get('http://localhost:8080/api/v1/Usuario');
      const usuarios = response.data;
      const usuarioLogado = usuarios.find(u => u.email === user.email);

      if (!usuarioLogado) {
        toast.error('Usuário não encontrado.');
        return;
      }

      // Atualizar usuário via PUT
      await axios.put(`http://localhost:8080/api/v1/Usuario/${usuarioLogado.id}`, {
        ...usuarioLogado,
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });

      toast.success('Informações alteradas com sucesso!')
      setOriginalData(formData); // Atualiza referência
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao salvar alterações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='clientinfo-page'>
      <div className='clientinfo-sidemenu'>
        <SideMenuCLIENT />
      </div>
      <div className='clientinfo-container'>
        <div className='clientinfo-inputs-container'>
          <h1>INFORMAÇÕES DA CONTA</h1>
          <h3>Apenas você tem acesso a estas<br /> informações pessoais.</h3>

          <p className='clientinfo-label'>NOME</p>
          <input
            className='clientinfo-input'
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />

          <p className='clientinfo-label'>EMAIL</p>
          <input
            className='clientinfo-input'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <p className='clientinfo-label'>SENHA</p>
          <input
            className='clientinfo-input'
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
          />

          {/* Botão Salvar Alterações */}
          <button
            className='clientinfo-save-button'
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientAccInfo;
