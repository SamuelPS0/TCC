import React, { useState, useEffect } from 'react';
import SideMenuCLIENT from '../../Components/SideMenu/SideMenuCLIENT/SideMenuCLIENT';
import { useAuth } from '../../Components/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading';
import './ClientAccInfo.css';
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const passwordRules = [
  {
    label: 'Letra maiúscula',
    test: (value = '') => /[A-Z]/.test(value)
  },
  {
    label: 'Letra minúscula',
    test: (value = '') => /[a-z]/.test(value)
  },
  {
    label: 'Número',
    test: (value = '') => /\d/.test(value)
  },
  {
    label: 'Pontuação',
    test: (value = '') =>
      /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\`;']/.test(value)
  }
];

const isStrongPassword = (value = '') =>
  passwordRules.every((rule) => rule.test(value));

const normalizeSecurityAnswer = (text = '') =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

function ClientAccInfo() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    ps_01: '',
    ps_02: ''
  });

  const [originalData, setOriginalData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get('http://localhost:8080/api/v1/usuario/me')
      .then((response) => {
        const usuarioLogado = response.data;

        const data = {
          id: usuarioLogado.id,
          nome: usuarioLogado.nome || '',
          email: usuarioLogado.username || '',
          senha: '', // nunca exponha senha real
        };

        setFormData(data);
        setOriginalData(data);
      })
      .catch(() => {
        toast.error('Não foi possível carregar suas informações.');
      });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      toast.warning('Nenhuma alteração detectada.');
      return;
    }

    if (!isStrongPassword(formData.senha)) {
      toast.error('A senha não atende aos requisitos.');
      return;
    }

    const toastId = toast.loading('Atualizando informações...');

    try {
      const payload = {
        nome: formData.nome,
        username: formData.email,
        password: formData.senha,
      };

      await axios.put(
        `http://localhost:8080/api/v1/usuario/${formData.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setOriginalData(formData);

      toast.success('Informações alteradas com sucesso!', {
        id: toastId,
      });

    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar alterações.', {
        id: toastId,
      });
    }
  };

  return (
    <>
      {showLoader && (
        <Loading fadeOut={fadeOut} />
      )}

      {!showLoader && (
        <div className="clientinfo-page">

          <div className="clientinfo-sidemenu">
            <SideMenuCLIENT />
          </div>

          <div className="clientinfo-container">
            <div className="clientinfo-inputs-container">
              <div className="cic">

                <h1>INFORMAÇÕES DA CONTA</h1>

                <h3>
                  Apenas você tem acesso a estas
                  <br />
                  informações pessoais.
                </h3>

                <p className="clientinfo-label">
                  NOME
                </p>

                <input
                  className="clientinfo-input"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />

                <p className="clientinfo-label">
                  EMAIL
                </p>

                <input
                  className="clientinfo-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                />

                <p className="clientinfo-label">
                  SENHA
                </p>

                <div className="clientinfo-password-wrapper">
                  <input
                    className="clientinfo-input clientinfo-password-input"
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="clientinfo-password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    marginBottom: 20
                  }}
                >
                  <div className="clientinfo-password-rules">
                    {passwordRules.map((rule) => {
                      const valid = rule.test(formData.senha);

                      return (
                        <span
                          key={rule.label}
                          className={`clientinfo-password-rule ${valid ? 'clientinfo-password-rule--valid' : ''
                            }`}
                        >
                          {valid ? <FaCheckCircle /> : <FaTimesCircle />}
                          {rule.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="clientinfo-security-row">

                  <div className="clientinfo-security-column">
                    <input
                      className="clientinfo-input"
                      type="text"
                      name="ps_01"
                      value={formData.ps_01}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="clientinfo-security-column">
                    <input
                      className="clientinfo-input"
                      type="text"
                      name="ps_02"
                      value={formData.ps_02}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <button
                  className="clientinfo-save-button"
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