import React, { useEffect, useState } from 'react';
import './DevUser.css'
import AdmUserComponent from '../../../Components/ADM/AdmUserComponent/AdmUserComponent';
import AdmPeopleSearchbar from '../../../Components/ADM/AdmPeopleSearchbar/AdmPeopleSearchbar';
import HeaderSwitcher from '../../../Components/HeaderSwitcher'
import SearchBar from '../../../Components/SearchBar/SearchBar'



const DevUser = () => {
  return (
    <div>
      <HeaderSwitcher />
      <div className="devuser-body">
        <div className='devuser-APS'>
      <AdmPeopleSearchbar /></div>
      <div className='devuser-auc'>
      <AdmUserComponent id/>

        </div>
      </div>
    </div>
  )
}

export default DevUser