import React from 'react';
import './AccInfo.css';
import { Link } from 'react-router-dom';

export default function AccInfo(){
    return(
        <div>
            <h1>AccInfo</h1>
            <Link to={"/"}>Home</Link>
        </div>
    )
}