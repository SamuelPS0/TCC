import React, { useState } from 'react';
import './DevUser.css';
import AdmUserComponent from '../../../Components/ADM/AdmUserComponent/AdmUserComponent';
import AdmPeopleSearchbar from '../../../Components/ADM/AdmPeopleSearchbar/AdmPeopleSearchbar';
import HeaderSwitcher from '../../../Components/HeaderSwitcher';
import Loading from '../../../Components/Loading/Loading';

const DevUser = () => {
  const [termoBusca, setTermoBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  const handleSearch = (texto) => {
    setTermoBusca(texto);
  };

  return (
    <>
      {carregando ? (
        <Loading onComplete={() => setCarregando(false)} />
      ) : (
        <div>
          <HeaderSwitcher />
          <div className="devuser-body">
            <div className='devuser-APS'>
              <AdmPeopleSearchbar onSearch={handleSearch} />
            </div>

            <div className='devuser-auc'>
              <AdmUserComponent termoBusca={termoBusca} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevUser;
