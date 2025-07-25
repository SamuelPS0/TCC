import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import accessLevels from '../Components/accessLevels';

const ProtectedRoute = ({ children, requiredLevel }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.level > requiredLevel) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
