import React from 'react'
import './DevUser.css'
import AdmUserComponent from '../../../Components/ADM/AdmUserComponent/AdmUserComponent';
import AdmPeopleSearchbar from '../../../Components/ADM/AdmPeopleSearchbar/AdmPeopleSearchbar';
import HeaderSwitcher from '../../../Components/HeaderSwitcher'
import SearchBar from '../../../Components/SearchBar/SearchBar'

const DevUser = () => {
  return (
    <div>DevUser
      <HeaderSwitcher />
      <div className="devuser-body">
      <AdmPeopleSearchbar />
      <div className='devuser-auc'>
      <AdmUserComponent/>
      <AdmUserComponent/>
      <AdmUserComponent/>
      <AdmUserComponent/>
      <AdmUserComponent/>
      <AdmUserComponent/>
      <AdmUserComponent/>
      <AdmUserComponent/>
      <AdmUserComponent/>
      </div>
      </div>
    </div>
  )
}

export default DevUser