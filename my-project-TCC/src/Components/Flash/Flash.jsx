import React from 'react';
import './Flash.css';

// Componente funcional Flash que recebe props via parâmetro 'flashprops'
const Flash = (flashprops) => {
  return (
    // Container principal com classe para estilização
    <div className="flash-wrapper">

      {/* Cabeçalho do flash, geralmente para o título */}
      <div className="flash-header">
        {/* Exibe o título passado via props */}
        <h1 className='flash-h1'>{flashprops.title}</h1>
      </div>

      {/* Conteúdo do flash, área para o texto */}
      <div className="flash-content">
        {/* Parágrafo exibindo o texto passado via props */}
        <p className='flash-p'>{flashprops.paragraph}</p>
      </div>

    </div>
  )
}

export default Flash;
