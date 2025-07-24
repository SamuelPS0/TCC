import React from 'react';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import accessLevels from './accessLevels';
import HeaderCliente from './Header/levelHeaders/HeaderCliente';
import HeaderPrestador from './Header/levelHeaders/HeaderPrestador';
import Header0 from './Header/levelHeaders/Header0';

export default function HeaderSwitcher(props) {
  const { user } = useAuth();
  const location = useLocation();

  // Proteção caso user seja null
  if (!user || user.accessLevel === accessLevels.GUEST) {
    // Se quiser o Header0 só na landing '/', pode usar:
    if (location.pathname === '/') {
      return <Header0 {...props} />;
    }
    // Se quiser Header0 para guest em todas as páginas:
    return <Header0 {...props} />;
  }

  switch(user.accessLevel) {
  //  case accessLevels.ADMIN:
  //    return <HeaderAdmin {...props} />;
    case accessLevels.PRESTADOR:
      return <HeaderPrestador {...props} />;
    case accessLevels.CLIENTE:
      return <HeaderCliente {...props} />;
    default:
      return <Header0 {...props} />;
  }
}
