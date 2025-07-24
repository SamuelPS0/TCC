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

    if (user.accessLevel === accessLevels.GUEST && location.pathname === '/') {
    return <Header0 {...props} />;
  }

  if (user.accessLevel === accessLevels.ADMIN) {
    return <HeaderAdmin {...props} />;
  } else if (user.accessLevel === accessLevels.PRESTADOR) {
    return <HeaderPrestador {...props} />;
  } else {
    return <HeaderCliente {...props} />;
  }
}
