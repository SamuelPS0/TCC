import React, { useState, useEffect } from 'react';
import SideMenuCLIENT from '../../Components/SideMenu/SideMenuCLIENT/SideMenuCLIENT';
import { useAuth } from '../../Components/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading';
import './ClientAccInfo.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ClientAccInfo() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const [originalData, setOriginalData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShowLoader(false), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user?.email) {
      axios.get('http://localhost:8080/api/v1/Usuario')
        .then((response) => {
          const usuarios = response.data;
          const usuarioLogado = usuarios.find(u => u.email === user.email);

          if (usuarioLogado) {
            const data = {
              nome: usuarioLogado.nome || '',
              email: usuarioLogado.email || '',
              senha: usuarioLogado.senha || '',
            };

            setFormData(data);
            setOriginalData(data);
          }
        })
        .catch(() => {
          toast.error('Não foi possível carregar suas informações.');
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      toast.warning('Nenhuma alteração detectada.');
      return;
    }

    const toastId = toast.loading('Atualizando informações...');

    try {
      const response = await axios.get('http://localhost:8080/api/v1/Usuario');
      const usuarioLogado = response.data.find(u => u.email === user.email);

      if (!usuarioLogado) {
        toast.error('Usuário não encontrado.', { id: toastId });
        return;
      }

      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        nivelAcesso: usuarioLogado.nivelAcesso,
        dataCadastro: usuarioLogado.dataCadastro,
        statusUsuario: usuarioLogado.statusUsuario,
      };

      await axios.put(
        `http://localhost:8080/api/v1/Usuario/${usuarioLogado.id}`,
        payload
      );

      toast.success('Informações alteradas com sucesso!', { id: toastId });
      setOriginalData(formData);

    } catch {
      toast.error('Erro ao salvar alterações.', { id: toastId });
    }
  };

  return (
    <>
      {showLoader && <Loading fadeOut={fadeOut} />}

      {!showLoader && (
        <div className='clientinfo-page'>
          <div className='clientinfo-sidemenu'>
            <SideMenuCLIENT />
          </div>

          <div className='clientinfo-container'>
            <div className='clientinfo-inputs-container'>
              <div className='cic'>

                <h1>INFORMAÇÕES DA CONTA</h1>
                <h3>Apenas você tem acesso a estas<br /> informações pessoais.</h3>

                {/* NOME */}
                <p className='clientinfo-label'>NOME</p>
                <input
                  className='clientinfo-input'
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />

                {/* EMAIL */}
                <p className='clientinfo-label'>EMAIL</p>
                <input
                  className='clientinfo-input'
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {/* SENHA */}
                <p className='clientinfo-label'>SENHA</p>
                <div className='clientinfo-password-wrapper'>
                  <input
                    className='clientinfo-input clientinfo-password-input'
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className='clientinfo-password-toggle'
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  className='clientinfo-save-button'
                  onClick={handleSave}
                >
                  Salvar alterações
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClientAccInfo;