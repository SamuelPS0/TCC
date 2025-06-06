import React from 'react'
import './DropdownContent.css';
const DropdownContent = ({children}) => {
  return (
    <div className='dropdown-content'>
      {children}
    </div>
  )
}

export default DropdownContent
