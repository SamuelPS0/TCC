import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import accessLevels from './accessLevels';
import { getUsuarioEmail, normalizeStatusUsuario, usuarioService } from '../services/usuarioService';

const AuthContext = createContext();

const STORAGE_KEY = 'user';

const guestUser = {
  id: null,
  email: null,
  username: null,
  nome: null,
  accessLevel: accessLevels.GUEST,
  nivelAcesso: accessLevels.GUEST,
  statusUsuario: null,
};

const getUsuarioId = (userData = {}) => {
  const id = Number(userData.id ?? userData.usuarioId ?? userData.usuario?.id);
  return !Number.isNaN(id) && id > 0 ? id : null;
};

const normalizeAuthUser = (userData) => {
  if (!userData) return guestUser;

  const accessLevel = userData.accessLevel ?? userData.nivelAcesso ?? accessLevels.GUEST;
  const email = getUsuarioEmail(userData);
  const id = getUsuarioId(userData);

  return {
    ...userData,
    id,
    usuarioId: id,
    email,
    username: email,
    nome: userData.nome ?? userData.usuario?.nome ?? null,
    accessLevel,
    nivelAcesso: accessLevel,
    statusUsuario: userData.statusUsuario
      ? normalizeStatusUsuario(userData.statusUsuario)
      : userData.statusUsuario,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(guestUser);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const restoreUser = async () => {
      const storedUser = localStorage.getItem(STORAGE_KEY);

      if (storedUser) {
        try {
          const normalizedUser = normalizeAuthUser(JSON.parse(storedUser));
          setUser(normalizedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));

          if (normalizedUser.id) {
            localStorage.setItem('usuarioId', String(normalizedUser.id));
          }

          return;
        } catch (error) {
          console.error('Erro ao restaurar usuário logado:', error);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem('usuarioId');
        }
      }

      try {
        const response = await usuarioService.me();
        const normalizedUser = normalizeAuthUser(response.data);

        setUser(normalizedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));

        if (normalizedUser.id) {
          localStorage.setItem('usuarioId', String(normalizedUser.id));
        }
      } catch {
        setUser(guestUser);
      }
    };

    restoreUser().finally(() => setAuthReady(true));
  }, []);

  const login = (userData) => {
    const normalizedUser = normalizeAuthUser(userData);

    setUser(normalizedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));

    if (normalizedUser.id) {
      localStorage.setItem('usuarioId', String(normalizedUser.id));
    }
  };

  const logout = () => {
    setUser(guestUser);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('usuarioId');
  };

  const value = useMemo(
    () => ({ user, authReady, login, logout }),
    [user, authReady]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);