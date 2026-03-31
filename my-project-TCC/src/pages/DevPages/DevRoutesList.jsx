import React from 'react';
import { Link } from 'react-router-dom';

export default function DevRoutesList() {
  const routes = [
    '/', '/login', '/register', '/sobre-nos',
    '/forgot-password', '/home-list', '/client-accinfo',
    '/privacity', '/cards',

    // protegidas
    '/acc-info', '/create-perfil', '/profile',
    '/profileprestador', '/security-questions',

    // dev
    '/dev-hub', '/dev-category', '/dev-user',
    '/dev-view-client', '/dev-view-prestador/1',
    '/dev-view-adm'
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h1>Lista de Rotas</h1>

      <ul>
        {routes.map((route, index) => (
          <li key={index}>
            <Link to={route}>{route}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}