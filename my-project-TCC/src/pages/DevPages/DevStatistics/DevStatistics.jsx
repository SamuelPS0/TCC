import React from 'react';
import './DevStatistics.css';
import HeaderSwitcher from '../../../Components/HeaderSwitcher';
import Grafico from '../../../img/imagecopy.png';
import Grafico2 from '../../../img/image.png';

const DevStatistics = () => {
  return (
  <div classname='oi'>
      <HeaderSwitcher />
    <div className="dev-statistics">
      <div className ='imgimgimg'>
      <img src={Grafico} alt="Dev Statistics Chart" className="statistics-chart" />
      <img src={Grafico2} alt="Dev Statistics Chart" className="statistics-chart" />
      <div>
      <img src={Grafico} alt="Dev Statistics Chart" className="statistics-chart" />
      <img src={Grafico2} alt="Dev Statistics Chart" className="statistics-chart" />
      </div>
      </div>
    </div>
    </div>
  );
};

export default DevStatistics;
