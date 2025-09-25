import React, { useState } from 'react';
import AdmCategoryComponent from '../../../Components/ADM/AdmCategoryComponent/AdmCategoryComponent';
import HeaderSwitcher from '../../../Components/HeaderSwitcher';

const DevCategory = () => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [novoNome, setNovoNome] = useState('');

  // Função passada para AdmCategoryComponent para abrir a edição
  const handleEdit = (fget) => {
    setCategoriaSelecionada(fget);
  };

  return (
    <div>
     <HeaderSwitcher />
      <div className="devcategory-body">
        <AdmCategoryComponent/>

      </div>
    </div>
  );
};

export default DevCategory;
