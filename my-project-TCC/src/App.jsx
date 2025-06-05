import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import './pages/Logo/logo'
import './Components/Category'
import Header from './Components/Header';
import Category from './Components/Category';
import SearchBar from './Components/SearchBar';

function App() {
  return (
    <>
    <SearchBar />
       <Header />
       <div className='categorias'>
       <Category texto="Modelo de trabalho"/>
       <Category texto="Publicado em"/>
       <Category texto="Distância"/>
       <Category texto="Preço"/>
       <Category texto="Categorias"/>
       <Category texto="Disponibilidade"/>
       </div>
       
    </>
  );
}

export default App
