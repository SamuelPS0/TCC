import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import accessLevels from './accessLevels';

const ProtectedRoute = ({ children, requiredLevel }) => {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return null;
  }

  if (!user || user.accessLevel === accessLevels.GUEST) {
    return <Navigate to="/login" replace />;
  }

  if (requiredLevel && user.accessLevel !== requiredLevel) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;