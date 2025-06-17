// Importa o componente Routes e Route do react-router-dom
import { Routes, Route } from 'react-router-dom';

// Importa todas as páginas do seu app
import AccInfo from '../pages/AccInfo/AccInfo';
import CreatePerfil from '../pages/CreatePerfil/CreatePerfil';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import HomeList from '../pages/HomeList/HomeList';
import Login from '../pages/LoginForm/LoginForm';
import Perfil from '../pages/Profile/Profile';
import LandingPage from '../pages/LandingPage/LandingPage';
import Register from '../pages/Register/Register';
import SobreNos from '../pages/SobreNos/SobreNos';

// Define um componente funcional AppRoutes que contém TODAS as rotas
const AppRoutes = () => {
  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<LandingPage />} />

      {/* Página de lista de perfis com filtros */}
      <Route path="/home-list" element={<HomeList />} />

      {/* Página "Sobre Nós" */}
      <Route path="/sobre-nos" element={<SobreNos />} />

      {/* Página de login */}
      <Route path="/login" element={<Login />} />

      {/* Informações da conta */}
      <Route path="/acc-info" element={<AccInfo />} />

      {/* Cadastro de novo perfil */}
      <Route path="/create-perfil" element={<CreatePerfil />} />

      {/* Recuperar senha */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Página de perfil individual */}
      <Route path="/profile" element={<Perfil />} />

      {/* Página de registro */}
      <Route path="/register" element={<Register />} />

      {/* Rota coringa para páginas não encontradas */}
      <Route path="*" element={<h1>ERRO 404 - PÁGINA NÃO ENCONTRADA</h1>} />
    </Routes>
  );
};

// Exporta como default para usar no App.jsx
export default AppRoutes;
