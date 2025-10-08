import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios'
import './DevUser.css'
import AdmUserComponent from '../../../Components/ADM/AdmUserComponent/AdmUserComponent';
import AdmPeopleSearchbar from '../../../Components/ADM/AdmPeopleSearchbar/AdmPeopleSearchbar';
import HeaderSwitcher from '../../../Components/HeaderSwitcher'
import SearchBar from '../../../Components/SearchBar/SearchBar'

const [usuarios, setUsuarios] = useState([]);

  const carregarUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/usuario");
      setUsuarios(response.data);
      console.log('Usuarios atualizados:', response.data);
    } catch (error) {
      console.error("Erro ao carregar usuarios:", error);
    }
  };


const DevUser = () => {
  return (
    <div>
      <HeaderSwitcher />
      <div className="devuser-body">
        <div className='devuser-APS'>
      <AdmPeopleSearchbar /></div>
      <div className='devuser-auc'>
           <Table striped="columns">
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Senha</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>@mdo</td>
          <td>@mdo</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>@fat</td>
          <td>@fat</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>@twitter</td>
          <td>@twitter</td>
          <td>@twitter</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>
        </div>
      </div>
    </div>
  )
}

export default DevUser