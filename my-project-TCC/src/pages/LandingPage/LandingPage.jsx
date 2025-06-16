import React from 'react';
import './LandingPage.css';
import Flash from '../../Components/Flash/Flash';
import SearchBar from '../../Components/SearchBar/SearchBar';

export default function LandingPage() {
  return (
    <div>
      <h1>Landingpage</h1>
      <SearchBar shouldNavigate={true} />
      <Flash />        
    </div>  
  );
}
