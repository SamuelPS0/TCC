import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../Components/ProtectedRoute';
import accessLevels from '../Components/accessLevels';

import LandingPage from '../pages/LandingPage/LandingPage';
import Login from '../pages/LoginForm/LoginForm';
import Register from '../pages/Register/Register';
import HomeList from '../pages/HomeList/HomeList';
import Perfil from '../pages/Profile/Profile';
import PerfilPrestador from '../pages/Profile/ProfilePrestador';
import SobreNos from '../pages/SobreNos/SobreNos';
import AccInfo from '../pages/AccInfo/AccInfo';
import CreatePerfil from '../pages/CreatePerfil/CreatePerfil';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import SecurityQuestions from '../pages/SecurityQuestions/SecurityQuestions';
import ClientAccInfo from '../pages/ClientAccInfo/ClientAccInfo';
import DevHub from '../pages/DevPages/DevHub/DevHub';
import DevCategory from '../pages/DevPages/DevCategory/DevCategory';
import DevStatistics from '../pages/DevPages/DevStatistics/DevStatistics';
import DevUser from '../pages/DevPages/DevUser/DevUser';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sobre-nos" element={<SobreNos />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home-list" element={<HomeList />} />
      <Route path="/client-accinfo" element={<ClientAccInfo />} />
      <Route path="/unauthorized" element={<h1>Você não tem permissão para acessar esta página.</h1>} />

      {/* Rotas protegidas por nível de acesso */}
      <Route
        path="/acc-info"
        element={
          <ProtectedRoute requiredLevel={accessLevels.CLIENTE}>
            <AccInfo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-perfil"
        element={
          <ProtectedRoute requiredLevel={accessLevels.PRESTADOR}>
            <CreatePerfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredLevel={accessLevels.CLIENTE}>
            <Perfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profileprestador"
        element={
          <ProtectedRoute requiredLevel={accessLevels.PRESTADOR}>
            <PerfilPrestador />
          </ProtectedRoute>
        }
      />

      <Route
        path="/security-questions"
        element={
          <ProtectedRoute requiredLevel={accessLevels.CLIENTE}>
            <SecurityQuestions />
          </ProtectedRoute>
        }
      />

            <Route
        path="/dev-hub"
        element={
          <ProtectedRoute requiredLevel={accessLevels.ADMIN}>
            <DevHub />
          </ProtectedRoute>
        }
      />

            <Route
        path="/dev-category"
        element={
          <ProtectedRoute requiredLevel={accessLevels.ADMIN}>
            <DevCategory />
          </ProtectedRoute>
        }
      />

                  <Route
        path="/dev-statistics"
        element={
          <ProtectedRoute requiredLevel={accessLevels.ADMIN}>
            <DevStatistics />
          </ProtectedRoute>
        }
      />

                  <Route
        path="/dev-user"
        element={
          <ProtectedRoute requiredLevel={accessLevels.ADMIN}>
            <DevUser />
          </ProtectedRoute>
        }
      />

      {/* Página não encontrada */}
      <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;
