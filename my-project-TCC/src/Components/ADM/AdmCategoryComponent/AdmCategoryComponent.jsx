import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdmCategoryComponent.css';
import { MdDeleteForever , MdModeEditOutline } from "react-icons/md";

const AdmCategoryComponent = () => {
  const [categorias, setCategorias] = useState([]);

useEffect(() => {
  axios.get('http://localhost:8080/api/v1/categoria')
    .then(res => {
      console.log(res.data)
      setCategorias(res.data);
    })
    .catch(error => console.error(error));
}, []);


  return (
    <div className='adm-category-body'>
     <table className="adm-category-table">
      <tbody>

        {categorias.map(fget => (
          <tr className='adm-category-item' key={fget.id}>
            <td>{fget.nome}</td>

            <td className='adm-category-actions'>
              <button className='adm-category-button'>
                <MdModeEditOutline id='adm-category-icon-edit' className='adm-category-icon'/>
              </button>
              <button className='adm-category-button'>
                <MdDeleteForever id='adm-category-icon-delete' className='adm-category-icon'/>
              </button>
            </td>
          </tr>

        ))}
      </tbody>
    </table>
  </div>
  );
};

export default AdmCategoryComponent;
