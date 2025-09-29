import React from 'react';
import './AdmCategoryComponent.css';
import { MdDeleteForever , MdModeEditOutline } from "react-icons/md";

const AdmCategoryComponent = ({ categorias }) => {

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
