import React, { createContext, useContext, useState } from 'react';
import accessLevels from './accessLevels';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ email: null, accessLevel: accessLevels.GUEST });

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser({ email: null, accessLevel: accessLevels.GUEST });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
