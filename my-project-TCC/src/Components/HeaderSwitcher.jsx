import React from 'react';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import accessLevels from './accessLevels';
import HeaderCliente from './Header/levelHeaders/HeaderCliente';
import HeaderPrestador from './Header/levelHeaders/HeaderPrestador';
import HeaderAdmin from './Header/levelHeaders/HeaderAdmin';
import Header0 from './Header/levelHeaders/Header0';

const getHeaderName = (user) => {
  if (!user || user.accessLevel === accessLevels.GUEST) return 'Header0';

  switch (user.accessLevel) {
    case accessLevels.ADMIN:
      return 'HeaderAdmin';
    case accessLevels.PRESTADOR:
      return 'HeaderPrestador';
    case accessLevels.CLIENTE:
      return 'HeaderCliente';
    default:
      return 'Header0';
  }
};

export default function HeaderSwitcher(props) {
  const { user, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    console.debug('[HeaderDebug] Aguardando authReady antes de escolher header.', {
      path: location.pathname,
    });
    return null;
  }

  const headerName = getHeaderName(user);

  console.debug('[HeaderDebug] Header escolhido para usuário.', {
    headerName,
    path: location.pathname,
    id: user?.id,
    nome: user?.nome,
    email: user?.email,
    rawAccessLevel: user?.rawAccessLevel,
    accessLevel: user?.accessLevel,
    nivelAcesso: user?.nivelAcesso,
    statusUsuario: user?.statusUsuario,
  });

  switch (headerName) {
    case 'HeaderAdmin':
      return <HeaderAdmin {...props} />;
    case 'HeaderPrestador':
      return <HeaderPrestador {...props} />;
    case 'HeaderCliente':
      return <HeaderCliente {...props} />;
    default:
      return <Header0 {...props} />;
  }
}