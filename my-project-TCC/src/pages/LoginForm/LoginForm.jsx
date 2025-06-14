import './LoginForm.css'
import Login from '../../Components/Login/Login'
import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm(){
    return(
        <div className='loginform-adjustment'>
        <Login />
        <Link to={"/forgot-password"} className='forgot-quick-edit'>Esqueceu a senha?</Link>
        </div>
    )
}