import {React, useEffect,} from 'react';
import HeaderSwitcher from '../../Components/HeaderSwitcher';
import Cards from '../../Components/Cards/Cards'
import './HomeList.css'

const HomeList = () => {
  console.log("HomeList renderizou");
  return (
    <div>
      <HeaderSwitcher />
      <div className='homelist-cards'>
      <Cards />

      </div>
    </div>
  );
};

export default HomeList;
