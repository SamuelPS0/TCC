import React from 'react';
import { IoPersonCircle } from "react-icons/io5";
import { IoShieldOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { Link } from 'react-router-dom';
import './SideMenu.css'

export default function SideMenu(){
    return(
        <div className='container-sidemenu'>
            <ul>
                
                <li><Link to="/create-perfil" className='menu-li'><IoPersonCircle />Perfil</Link></li>
                <li><Link to='/acc-info' className='menu-li'><IoShieldOutline />Informações da conta</Link></li>
                <li><Link to='/' className='menu-li'><IoMdArrowBack />Voltar a tela inicial</Link></li>
                <li className='menu-li'><CiLogout />Sair</li>
            </ul>
        </div>
    );
};