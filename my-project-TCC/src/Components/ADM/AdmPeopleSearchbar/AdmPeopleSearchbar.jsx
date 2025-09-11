import {React, useState} from 'react'
import './AdmPeopleSearchbar.css'

const AdmPeopleSearchbar = () => {

    const [admppl, setAdmppl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // evita recarregar a página
    alert(`Você digitou: ${admppl}`);
    setAdmppl(""); // limpa o campo
  };

  return (
    <div className='APS'>
      <h2 className='APS-h2'>Pesquisa</h2>
      <form onSubmit={handleSubmit} >
        <input className='APS-inputcontainer'
          type="text"
          placeholder="Insira o nome do usuário"
          value={admppl}
          onChange={(e) => setAdmppl(e.target.value)}
        />
        <button className='APS-button'>
          Enviar
        </button>
      </form>
    </div>
  )
}

export default AdmPeopleSearchbar