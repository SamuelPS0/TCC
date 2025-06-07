import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

export default function Login(){
    return(
        <div>
            <h1>Login</h1>
            <Link to={"/home"}>Home</Link>
        </div>
    )
}