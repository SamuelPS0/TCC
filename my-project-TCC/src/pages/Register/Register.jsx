import React from 'react';
import './Register.css';
import { Link } from 'react-router-dom';

export default function Register(){
    return(
        <div>
            <h1>Register</h1>
            <Link to={"/home"}>Register</Link>
        </div>
    )
}