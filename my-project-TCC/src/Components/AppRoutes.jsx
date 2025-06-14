// AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AccInfo from '../pages/AccInfo/AccInfo';
import CreatePerfil from '../pages/CreatePerfil/CreatePerfil';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import Home from '../pages/Home/Home';
import Login from '../pages/LoginForm/LoginForm';
import Perfil from '../pages/Profile/Profile';
import Register from '../pages/Register/Register';
import SobreNos from '../pages/SobreNos/SobreNos';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre-nos" element={<SobreNos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/acc-info" element={<AccInfo />} />
      <Route path="/create-perfil" element={<CreatePerfil />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Perfil />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<h1>ERRO 404 - PÁGINA NÃO ENCONTRADA</h1>} />
    </Routes>
  );
};

export default AppRoutes;
