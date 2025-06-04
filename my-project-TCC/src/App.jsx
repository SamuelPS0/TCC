import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Header from './Components/Header';
import './pages/Home/home'
import './App.css'
import './pages/Logo/logo'

function App() {
  const [count, setCount] = useState(0)

  return (
       <Header />
  );
}

export default App
