import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import CreatePerfil from '../CreatePerfil/CreatePerfil';
import './Profile.css';

export default function Perfil(){
    return(
        <div className='container-profile'>
            <h1>Perfil</h1>
            <Link to={"/"}>Home</Link>
            <Header />
            <div className='container-wrapper'>
                <div className='container-main'>
                    
                </div>
                

            </div>
        </div>
    )
}