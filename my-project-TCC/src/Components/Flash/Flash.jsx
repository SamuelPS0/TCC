import React from 'react';
import './Flash.css';

const Flash = (flashprops) => {
  return (
      <div className="flash-wrapper">

      <div className="flash-header">
      <h1 className='flash-h1'>{flashprops.title}</h1>
      </div>
      <div className="flash-content">
      <p className='flash-p'>{flashprops.paragraph}</p>
      </div>
    </div>
  )
}

export default Flash