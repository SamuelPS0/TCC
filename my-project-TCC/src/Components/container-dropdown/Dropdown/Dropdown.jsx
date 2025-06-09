import React, { useState, useEffect, useRef } from 'react';

import './Dropdown.css';
import DropdownButton from '../DropdownButton/DropdownButton';
import DropdownContent from '../DropdownContent/DropdownContent';

const Dropdown = ({ ButtonText, content }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <DropdownButton toggle={toggleDropdown} open={open}>
        {ButtonText}
      </DropdownButton>
      <DropdownContent open={open}>{content}</DropdownContent>
    </div>
  );
};
/*Conteúdo para colocar no home caso o dropdown volte

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


      <div className='dropdown-nav'>
    <div className="content">
      {dropdownConfigs.map(({ label, options }) => (
        <CustomDropdown key={label} label={label} options={options} />
        
      ))}
      </div>
    </div>
    
*/
export default Dropdown;
