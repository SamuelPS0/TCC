import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Header from './Components/Header';
import './pages/Home/home'
import './App.css'
import './pages/Logo/logo'
import './Components/Category'
import Category from './Components/Category';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Header />
       <Category />

    </>
  );
}

export default App
