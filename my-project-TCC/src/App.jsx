import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Components/AppRoutes'; 
import { AuthProvider } from './Components/AuthContext'; 
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
