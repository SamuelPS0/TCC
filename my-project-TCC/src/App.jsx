import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Components/AppRoutes'; 
import { AuthProvider } from './Components/AuthContext'; 
import { Toaster } from 'sonner'; 
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
          <Toaster position="bottom-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
