import React, { useState } from 'react';
import './AdmUserComponent.css';
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaRegClipboard, FaRegAngry } from "react-icons/fa";

// Importando os modais diretamente
function FeedbackModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay profilePrestador-modal" onClick={onClose}>
      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <h1>MEUS FEEDBACKS</h1>
        <p>Registre aqui a sua denúncia e nossa equipe o ajudará assim que possível!</p>

        <div className="modal-grid">
          <div className="modal-card"><h2>FEEDBACKS 1</h2><p>Texto explicativo breve sobre o feedback 1.</p></div>
          <div className="modal-card"><h2>FEEDBACKS 2</h2><p>Texto explicativo breve sobre o feedback 2.</p></div>
          <div className="modal-card"><h2>FEEDBACKS 3</h2><p>Texto explicativo breve sobre o feedback 3.</p></div>
          <div className="modal-card"><h2>FEEDBACKS 4</h2><p>Texto explicativo breve sobre o feedback 4.</p></div>
        </div>

        <button className="modal-close-btn" onClick={onClose}>FECHAR</button>
      </div>
    </div>
  );
}

function DenunciaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay profilePrestador-modal" onClick={onClose}>
      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <h1><span className='modal-span'>MINHAS DENÚNCIAS</span></h1>
        <p>Confira abaixo um resumo das denúncias registradas.</p>

        <div className="modal-grid">
          <div className="modal-card"><h2>DENÚNCIAS 1</h2><p>Texto explicativo breve sobre a denúncia 1.</p></div>
          <div className="modal-card"><h2>DENÚNCIAS 2</h2><p>Texto explicativo breve sobre a denúncia 2.</p></div>
          <div className="modal-card"><h2>DENÚNCIAS 3</h2><p>Texto explicativo breve sobre a denúncia 3.</p></div>
          <div className="modal-card"><h2>DENÚNCIAS 4</h2><p>Texto explicativo breve sobre a denúncia 4.</p></div>
        </div>

        <button className="modal-close-btn" onClick={onClose}>FECHAR</button>
      </div>
    </div>
  );
}

const AdmUserComponent = () => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openDenunciaModal, setOpenDenunciaModal] = useState(false);

  return (
    <div>
      <div className="auc-card-body">
        <div className="auc-firstCointainer">
          <IoPersonCircleOutline className='auc-personicon' />
          <h1>USUÁRIO</h1>
        </div>

        <div className="auc-secondContainer">
          <FaRegClipboard
            className='auc-clipicon'
            onClick={() => setOpenFeedbackModal(true)}
            title="Ver Feedbacks"
            style={{ cursor: "pointer" }}
          />
          <FaRegAngry
            className='auc-angryicon'
            onClick={() => setOpenDenunciaModal(true)}
            title="Ver Denúncias"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Modais vinculados aos ícones */}
      <FeedbackModal
        isOpen={openFeedbackModal}
        onClose={() => setOpenFeedbackModal(false)}
      />
      <DenunciaModal
        isOpen={openDenunciaModal}
        onClose={() => setOpenDenunciaModal(false)}
      />
    </div>
  );
};

export default AdmUserComponent;
