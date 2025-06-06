import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import './pages/Logo/logo'
import Dropdown from './Components/container-dropdown/Dropdown/Dropdown';
import Header from './Components/Header';

export default function App() {
  return (
    <>
      <Header />
      <div className="content">
        <Dropdown ButtonText="Dropdown" 
        content ={<p>Hello World!</p>}/>
        </div>

    </>
  );
}
