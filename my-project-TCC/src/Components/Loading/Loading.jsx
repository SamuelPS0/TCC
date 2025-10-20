import React from "react";
import "./Loading.css";
import loadingIMG from "../../img/LogoElipseCircular.png";

function Loading() {
  return (
    <div className="loading-container">
      <img src={loadingIMG} alt="Carregando..." className="loading-gif" />
      <p className="loading-text">Carregando<span className="dots"></span></p>
    </div>
  );
}

export default Loading;
