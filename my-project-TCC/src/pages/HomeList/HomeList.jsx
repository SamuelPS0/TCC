import React from 'react';
import HeaderSwitcher from '../../Components/HeaderSwitcher';
import Cards from '../../Components/Cards/Cards'

const HomeList = () => {
  console.log("HomeList renderizou");
  return (
    <div className='background-color-homepage'>
    
      <Cards /> {/* Renderiza todos os cards */}
    </div>
  );
};

export default HomeList;
