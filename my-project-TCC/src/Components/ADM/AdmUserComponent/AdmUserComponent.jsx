import React, { useState } from 'react';
import './AdmUserComponent.css';
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaRegClipboard, FaRegAngry } from "react-icons/fa";

  const AdmUserComponent = () => {
    return(
    <div className='auc-wrapper'>
      <div className='auc-profilebody'>
        <IoPersonCircleOutline className='auc-icon'/>
        <h1 className='auc-h1'>USUARIO</h1>
      </div>
      <div className='auc-options'>
      <h1 className='auc-verify'>PERFIL <br/>VERIFICADO</h1>
      <h1 className='auc-analize'>PERFIL <br/>VERIFICADO</h1>
      </div>
    </div>
    )
  }


export default AdmUserComponent;
