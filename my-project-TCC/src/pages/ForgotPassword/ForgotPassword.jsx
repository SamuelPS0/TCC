import React from 'react';
import './ForgotPassword.css';
import Login from '../../Components/Login/Login'
import { Link } from 'react-router-dom';

export default function ForgotPassword(){
    return(
        <div className="background-forgotpassword">
        <div className='container-forgotpassword'>
            <div className='login-wrapper-forgotpassword'>
            <Login />
            </div>
        </div>
    </div>    
    )
}