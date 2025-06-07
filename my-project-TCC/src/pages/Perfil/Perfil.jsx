import React from 'react';
import { Link } from 'react-router-dom';
import './Perfil.css';

export default function Perfil(){
    return(
        <div>
            <h1>Perfil</h1>
            <Link to={"/home"}>Home</Link>
        </div>
    )
}