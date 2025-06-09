import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

export default function Perfil(){
    return(
        <div className='container-profile'>
            <h1>Perfil</h1>
            <Link to={"/"}>Home</Link>
        </div>
    )
}