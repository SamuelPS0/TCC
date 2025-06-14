import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Components/AppRoutes';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
