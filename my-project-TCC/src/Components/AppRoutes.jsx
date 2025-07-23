import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../Components/ProtectedRoute';
import accessLevels from '../Components/accessLevels';
import LandingPage from '../pages/LandingPage/LandingPage';
import Login from '../pages/LoginForm/LoginForm';
import Register from '../pages/Register/Register';
import HomeList from '../pages/HomeList/HomeList';
import Perfil from '../pages/Profile/Profile';
import SobreNos from '../pages/SobreNos/SobreNos';
import AccInfo from '../pages/AccInfo/AccInfo';
import CreatePerfil from '../pages/CreatePerfil/CreatePerfil';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import SecurityQuestions from '../pages/SecurityQuestions/SecurityQuestions';
import Apagar from '../pages/Apagar'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sobre-nos" element={<SobreNos />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home-list" element={<HomeList />} />
      <Route path='/apagar' element={<Apagar />} />

      <Route path="/unauthorized" element={<h1>Você não tem permissão para acessar esta página.</h1>} />

      {/* Rotas protegidas */}
      <Route
        path="/acc-info"
        element={
          <ProtectedRoute requiredLevel={accessLevels.USER}>
            <AccInfo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-perfil"
        element={
          <ProtectedRoute requiredLevel={accessLevels.USER}>
            <CreatePerfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredLevel={accessLevels.USER}>
            <Perfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/security-questions"
        element={
          <ProtectedRoute requiredLevel={accessLevels.USER}>
            <SecurityQuestions />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;
