import React from 'react';
import './Input.css';

// Componente funcional Input que recebe algumas props: 
// 'name' (texto para o label), 'inputName' (atributo name do input) e outros props espalhados via ...inputProps
const Input = ({ name, inputName, ...inputProps }) => {
  return (
    <div className="input-container"> {/* Container para estilizar o input e o texto */}
      <p>{name}</p> {/* Texto descritivo para o input */}
      {/* Input HTML que recebe o atributo 'name' e todos os outros atributos passados via props */}
      <input name={inputName} {...inputProps} />
    </div>
  );
};

export default Input;
