import React from 'react'
import './Modal.css'

export default function Modal({isOpen}) {
    
if (isOpen) 
    {
  return (
    <div className='modal-background'> 
    <div className='modal-container'>Modal</div>
    </div>
  )}
  return null;
}
