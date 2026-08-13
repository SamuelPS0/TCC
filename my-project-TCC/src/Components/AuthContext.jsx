import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import accessLevels from './accessLevels';
import { getUsuarioEmail, normalizeStatusUsuario, usuarioService } from '../services/usuarioService';

const AuthContext = createContext();

const STORAGE_KEY = 'user';
const AUTH_DEBUG_PREFIX = '[AuthDebug]';

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

const getAuthorityValue = (authority) => {
  if (typeof authority === 'string') return authority;

  return (
    authority?.authority ??
    authority?.name ??
    authority?.role ??
    authority?.nivelAcesso ??
    ''
  );
};

const getRawAccessLevel = (userData = {}) => {
  const directAccessLevel =
    userData.accessLevel ??
    userData.nivelAcesso ??
    userData.role ??
    userData.tipoUsuario ??
    userData.usuario?.accessLevel ??
    userData.usuario?.nivelAcesso ??
    userData.usuario?.role ??
    userData.usuario?.tipoUsuario;

  if (directAccessLevel) return directAccessLevel;

  const authorities = userData.authorities ?? userData.roles ?? userData.perfis;

  if (Array.isArray(authorities)) {
    return authorities.map(getAuthorityValue).find(Boolean);
  }

  return getAuthorityValue(authorities);
};

const normalizeAccessLevel = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, '');

  if (normalized === accessLevels.ADMIN || normalized === 'ADM') {
    return accessLevels.ADMIN;
  }

  if (
    normalized === accessLevels.PRESTADOR ||
    normalized === 'PROVIDER' ||
    normalized === 'PRESTADOR_SERVICO' ||
    normalized === 'PRESTADOR_DE_SERVICO'
  ) {
    return accessLevels.PRESTADOR;
  }

  if (
    normalized === accessLevels.CLIENTE ||
    normalized === 'CLIENTE' ||
    normalized === 'USER' ||
    normalized === 'USUARIO'
  ) {
    return accessLevels.CLIENTE;
  }

  return accessLevels.GUEST;
};

const normalizeAuthUser = (userData) => {
  if (!userData) return guestUser;

  const rawAccessLevel = getRawAccessLevel(userData);
  const accessLevel = normalizeAccessLevel(rawAccessLevel);
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
    rawAccessLevel,
    statusUsuario: userData.statusUsuario
      ? normalizeStatusUsuario(userData.statusUsuario)
      : userData.statusUsuario,
  };
};

const logAuthUser = (event, userData) => {
  console.debug(AUTH_DEBUG_PREFIX, event, {
    id: userData?.id,
    usuarioId: userData?.usuarioId,
    nome: userData?.nome,
    email: userData?.email,
    username: userData?.username,
    rawAccessLevel: userData?.rawAccessLevel,
    accessLevel: userData?.accessLevel,
    nivelAcesso: userData?.nivelAcesso,
    statusUsuario: userData?.statusUsuario,
  });
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

          logAuthUser('Usuário restaurado do localStorage', normalizedUser);
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

        logAuthUser('Usuário restaurado via /usuario/me', normalizedUser);
      } catch {
        console.debug(AUTH_DEBUG_PREFIX, 'Nenhuma sessão ativa encontrada; usando visitante.');
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

    logAuthUser('Login normalizado e salvo', normalizedUser);
  };

  const logout = () => {
    console.debug(AUTH_DEBUG_PREFIX, 'Logout executado; removendo usuário local.');
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