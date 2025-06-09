import React from 'react';
import './SobreNos.css';
import { Link } from 'react-router-dom';

export default function SobreNos(){
    return(
        <div className='center'>
            <h1>SobreNos</h1>
            <Link to={"/"}>Home</Link>
        </div>
    )
}