import React from 'react';
import './Home.css'
import Header from '../../Components/Header/Header';
import CustomDropdown from '../../Components/container-dropdown/Dropdown-final/CustomDropdown';

    const dropdownConfigs = [
  {
    label: 'Modelo de trabalho',
    options: ['Presencial', 'Remoto', 'Híbrido'],
  },
  {
    label: 'Publicado em',
    options: ['Hoje', 'Última semana', 'Último mês'],
  },
  {
    label: 'Distância',
    options: ['100m', '500m', '2km', '10km'],
  },
  {
    label: 'Preço',
    options: ['R$50 - R$100', 'R$100 - R$200', 'R$200+'],
  },
  {
    label: 'Categorias',
    options: ['Confeiteiro', 'Boleiro', 'Cozinheiro'],
  },
  {
    label: 'Disponibilidade',
    options: ['Disponível', 'Indisponível'],
  },
];


const Home = () => (

    <>
      <Header />

      <div className='dropdown-nav'>
    <div className="content">
      {dropdownConfigs.map(({ label, options }) => (
        <CustomDropdown key={label} label={label} options={options} />
        
      ))}
      </div>
    </div>
    </>
)

export default Home;