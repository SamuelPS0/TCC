import React from 'react';
import './DropdownButton.css';
import {FaChevronDown} from  'react-icons/fa';
import {FaChevronUp} from  'react-icons/fa';
 
const DropdownButton = ({children, open, toggle}) => {
  return (
    <div onClick={toggle} 
    className={ `dropdown-btn ${open ?
      "button-open" : null}`}
      > 
      {children}
        <span className='toggle-icon'>
          {open ? <FaChevronUp /> :
        <FaChevronDown/>}
        </span>
    </div>
  );
}

export default DropdownButton;
