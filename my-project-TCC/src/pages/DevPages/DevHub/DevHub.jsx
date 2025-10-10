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
      <Link to='/dev-user' className="devhub-card">
        <h1>GERENCIAR USUARIOS</h1>
        </Link>
    
        <Link to='/dev-category' className="devhub-card">
        <h1>GERENCIAR<br/>  CATEGORIAS</h1>
        </Link>

      </div>
    </div>
    </div>
  )
}

export default DevHub