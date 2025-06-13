import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import './Home.css'
import PerfilList from '../../Components/PerfilList/PerfilList';

const Home = () => {
  return (
<div className='background-color-homepage'>
  <Header />
  <PerfilList />
</div>
  );
}

export default Home;
