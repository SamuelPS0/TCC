import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AccInfo from './pages/AccInfo/AccInfo';
import CreatePerfil from './pages/CreatePerfil/CreatePerfil';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Perfil from './pages/Perfil/Perfil';
import Register from './pages/Register/Register';
import SobreNos from './pages/SobreNos/SobreNos';

import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/sobre-nos" element={<SobreNos />} />
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/acc-info" element={<AccInfo />} />
        <Route path="/create-perfil" element={<CreatePerfil />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rota 404 */}
        <Route path="*" element={<h1>ERRO 404 - PÁGINA NÃO ENCONTRADA</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
