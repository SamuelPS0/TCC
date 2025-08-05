import React from 'react'
import './DevUser.css'
import AdmUserComponent from '../../../Components/AdmUserComponent/AdmUserComponent'
import HeaderSwitcher from '../../../Components/HeaderSwitcher'
import SearchBar from '../../../Components/SearchBar/SearchBar'

const DevUser = () => {
  return (
    <div>DevUser
      <HeaderSwitcher />
      <div className="devuser-body">
      <SearchBar />
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