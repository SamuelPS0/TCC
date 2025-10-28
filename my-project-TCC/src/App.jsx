import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Components/AppRoutes'; 
import { AuthProvider } from './Components/AuthContext'; 
import { Toaster } from 'sonner'; 
import Loading from './Components/Loading/Loading'; // importe seu Loading
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);  
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Toaster position="bottom-right" />
        {loading ? <Loading onComplete={() => setLoading(false)} /> : <AppRoutes />}
      </AuthProvider>
    </Router>
  );
}

export default App;
