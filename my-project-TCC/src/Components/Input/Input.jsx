import React from 'react';
import './Input.css';

const Input = ({ name, inputName, ...inputProps }) => {
  return (
    <div className="input-container">
      <p>{name}</p>
      <input name={inputName} {...inputProps} />
    </div>
  );
};

export default Input;
