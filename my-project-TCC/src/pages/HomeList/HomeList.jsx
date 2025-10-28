import React from "react";
import { useLocation } from "react-router-dom";
import HeaderSwitcher from "../../Components/HeaderSwitcher";
import Cards from "../../Components/Cards/Cards";
import SearchBar from "../../Components/SearchBar/SearchBar";
import './HomeList.css';

const HomeList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const category = params.get("category") || "";
  const city = params.get("location") || "";

  return (
    <div className="homelist-container">
      <HeaderSwitcher />
      <SearchBar 
        initialCategory={category} 
        initialLocation={city} 
        shouldNavigate={true} 
      />
      <Cards filter={{ category, city }} />
    </div>
  );
};

export default HomeList;
