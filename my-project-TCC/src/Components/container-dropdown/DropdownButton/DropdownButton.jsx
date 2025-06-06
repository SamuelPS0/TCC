import React from 'react';
import './DropdownButton.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const DropdownButton = ({ children, open, toggle }) => {
  return (
    <div
      onClick={toggle}
      className={`dropdown-btn ${open ? "button-open" : ""}`}
    >
      {children}
      <span className='toggle-icon'>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </span>
    </div>
  );
};

export default DropdownButton;
