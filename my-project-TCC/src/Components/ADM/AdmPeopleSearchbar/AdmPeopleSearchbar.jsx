import { React, useState } from 'react';
import './AdmPeopleSearchbar.css';

const AdmPeopleSearchbar = ({ onSearch }) => {
  const [admppl, setAdmppl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(admppl); // envia o texto digitado para o componente pai
  };

  return (
<div className='APS'>
  <form onSubmit={handleSubmit}>
    <div className="APS-field">
      <input
        className='APS-inputcontainer'
        type="text"
        placeholder="Insira o nome do usuário"
        value={admppl}
        onChange={(e) => setAdmppl(e.target.value)}
      />
      <label className="APS-label">Pesquisa</label>
    </div>
    <button type="submit" className='APS-button'>
      Buscar
    </button>
  </form>
</div>


  );
};

export default AdmPeopleSearchbar;
