import {React, useEffect,} from 'react';
import HeaderSwitcher from '../../Components/HeaderSwitcher';
import Cards from '../../Components/Cards/Cards'
import { useAuth } from '../../Components/AuthContext';
import './HomeList.css'

const HomeList = () => {
  console.log("HomeList renderizou");
  const { user } = useAuth();
  console.log("Usuario carregado", user)
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
