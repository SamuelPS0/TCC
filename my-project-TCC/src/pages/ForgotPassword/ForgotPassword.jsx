import React from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';

export default function ForgotPassword(){
    return(
        <div>
            <h1>ForgotPassword</h1>
            <Link to={"/home"}>Home</Link>
        </div>
    )
}