import React from 'react';
import { IoPersonCircle } from "react-icons/io5";
import { IoShieldOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import './SideMenu.css'

export default function SideMenu(){
    return(
        <div className='container-sidemenu'>
            <ul>
                <li className='menu-li'><IoPersonCircle />Perfil</li>
                <li className='menu-li'><IoShieldOutline />Informações da conta</li>
                <li className='menu-li'><IoMdArrowBack />Voltar a tela inicial</li>
                <li className='menu-li'><CiLogout />Sair</li>
            </ul>
        </div>
    );
};