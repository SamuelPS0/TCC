import {React, useState} from 'react';
import './ForgotPassword.css';
import Login from '../../Components/Login/Login'


export default function ForgotPassword(){
    const [valorA, setValorA] = useState('');
    const [valorB, setValorB] = useState('');

    return(
        <div className="container-forgotpassword">
            <div className='forgotpassword-login-edit' >
            <Login buttonText="Trocar senha" />
            </div>
            <div className='fp-second-container'>
                <h1 className='fp-h1'>PERGUNTAS DE <span>SEGURANÇA</span></h1>

                <h3 className='fp-h3'>QUAL NOME COMPLETO DA SUA MÃE?*</h3>
                <input id='margin-input' className='fp-input' type="text" value={valorA} onChange={(e) => setValorA(e.target.value)} placeholder="ESCREVA SUA RESPOSTA"/>
                 
                 <h3 className='fp-h3'><span>QUAL NOME DO SEU MELHOR AMIGO(A) DE INFÂNCIA?*</span></h3>
                <input className='fp-input' type="text" value={valorB} onChange={(e) => setValorB(e.target.value)} placeholder="ESCREVA SUA RESPOSTA"/>
           
            </div>
            </div>
    )
}