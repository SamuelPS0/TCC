import React from 'react';
import './CreatePerfil.css';
import { Link } from 'react-router-dom';

export default function CreatePerfil(){
    return(
        <div>
            <h1>CreatePerfil</h1>
            <Link to={"/home"}>Home</Link>
        </div>
    )
}