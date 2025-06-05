import React from 'react'
import './Category.css'
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Category(props){

    return(
        <div className='container-button'>
            <button className='button'>{props.texto}
            <MdKeyboardArrowDown />
            </button>
            </div>
    )
}
