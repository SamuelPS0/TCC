import React from 'react'
import './DevCategory.css'
import AdmCategoryComponent from '../../../Components/ADM/AdmCategoryComponent/AdmCategoryComponent'
import HeaderSwitcher from '../../../Components/HeaderSwitcher'
import SearchBar from '../../../Components/SearchBar/SearchBar'

const DevCategory = () => {
  return (
    <div>
      <HeaderSwitcher />
      <div className="devcategory-body">
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <AdmCategoryComponent  />
      <div className='devcategory-buttons'>
          <input type="text" name="" className="placeholder-category"  placeholder='Digite a categoria...' />
          <button type="button" className='button-category'>Adicionar categorias</button>
        </div>
      </div>
      </div>
  )
}

export default DevCategory