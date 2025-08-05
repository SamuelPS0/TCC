import React from 'react'
import { Link } from 'react-router-dom';
import './DevHub.css'

import HeaderSwitcher from '../../../Components/HeaderSwitcher';

const DevHub = () => {
  return (
    <div>
    <HeaderSwitcher />
    <div className="devhub-body">
      <div className="devhub-container-card">
      <div className="devhub-card">
        <Link to='/dev-user'>
        <h1>GERENCIAR USUARIOS</h1>
        </Link>
      </div>
      <div className="devhub-card">
        <Link to='/dev-category'>
        <h1>GERENCIAR CATEGORIAS</h1>
        </Link>
      </div>
      <div className="devhub-card">
        <Link to='/dev-statistics'>
        <h1>GERENCIAR ESTATÍSTICAS</h1>
        </Link>
      </div>

      </div>
    </div>
    </div>
  )
}

export default DevHub