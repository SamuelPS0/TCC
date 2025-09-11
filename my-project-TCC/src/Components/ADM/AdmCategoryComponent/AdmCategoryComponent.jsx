import React from 'react'
import './AdmCategoryComponent.css';
import { IoPencilSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const AdmCategoryComponent = () => {
  return (
    <div className='admcc-body'>
        <h1>Comida Japonesa</h1>
        <div className="admcc-icons">
            <IoPencilSharp className='admcc-pencil'/>
            <h1 className='admcc-x'>X</h1>
        </div>
        </div>
  )
}

export default AdmCategoryComponent