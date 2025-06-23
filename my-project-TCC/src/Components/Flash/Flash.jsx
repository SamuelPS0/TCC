import React from 'react';
import './Flash.css';

// Componente funcional Flash que recebe props via parâmetro 'flashprops'
const Flash = (flashprops) => {
  return (
    <div className="flash-wrapper">

      {/* Cabeçalho do flash*/}
      <div className="flash-header">
        {/* título passado via props */}
        <h1 className='flash-h1'>{flashprops.title}</h1>
      </div>

      <div className="flash-content">
        {/*texto passado via props */}
        <p className='flash-p'>{flashprops.paragraph}</p>
      </div>

    </div>
  )
}

export default Flash;
