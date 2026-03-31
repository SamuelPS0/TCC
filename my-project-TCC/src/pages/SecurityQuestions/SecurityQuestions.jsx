import React, { useState, useEffect } from 'react';
import './SecurityQuestions.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import AccountSecurity from '../../Components/AccountSecurity/AccountSecurity';

const SecurityQuestions = () => {
  const navigate = useNavigate();

  const [securityData, setSecurityData] = useState({
    ps_01: '',
    ps_02: ''
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('registerData');

    if (!stored) {
      toast.error('Sessão expirada. Faça o cadastro novamente.');
      navigate('/register');
      return;
    }

    setUserData(JSON.parse(stored));
  }, [navigate]);

  const handleSubmit = async () => {
    if (!securityData.ps_01 || !securityData.ps_02) {
      toast.error('Preencha todas as perguntas');
      return;
    }

    if (!userData) {
      toast.error('Erro nos dados do usuário');
      return;
    }

    try {
      const now = new Date();
      const dataFormatada = now.toISOString().slice(0, 19);

      const payload = {
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        nivelAcesso: userData.nivelAcesso,
        ps_01: securityData.ps_01,
        ps_02: securityData.ps_02,
        dataCadastro: dataFormatada,
        statusUsuario: true,
      };
      console.log('PAYLOAD:', payload);
      await axios.post('http://localhost:8080/api/v1/Usuario', payload);

      // limpa após sucesso
      localStorage.removeItem('registerData');

      toast.success('Usuário criado com sucesso!');
      navigate('/login');

    } catch (error) {
  console.error('STATUS:', error.response?.status);
  console.error('DATA:', error.response?.data);
  console.error('FULL:', error);

  toast.error('Erro ao finalizar cadastro');
}
  };

  return (
    <div className='sq-container'>
      <h1 className='sq-h1'>
        ESSAS INFORMAÇÕES AJUDAM A <span>PROTEGER SUA CONTA</span> E PODEM SER USADAS PARA <span>RECUPERAÇÃO</span> DE ACESSO.
      </h1>

      <div className='sq-second-container'>
        <AccountSecurity onChange={setSecurityData} />

        <button type="button" onClick={handleSubmit}>
          FINALIZAR CADASTRO
        </button>
      </div>
    </div>
  );
};

export default SecurityQuestions;