import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderSwitcher from "../../../../Components/HeaderSwitcher";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdImage, IoIosCall } from "react-icons/io";
import { FaMapMarkerAlt, FaList } from "react-icons/fa";
import ProfileImg from "../../../../img/Ellipse.png";
import InputImg from "../../../../img/crosant.png";
import './DevViewPrestador.css';

const DevViewPrestador = () => {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  

useEffect(() => {
  const fetchCard = async () => {
    try {
      const [servicosRes, contatosRes, feedbacksRes] = await Promise.all([
        axios.get("http://localhost:8080/api/v1/servico"),
        axios.get("http://localhost:8080/api/v1/contato"),
        axios.get("http://localhost:8080/api/v1/feedback"),
      ]);

      const servico = servicosRes.data[0]; // pegar primeiro serviço
      const prestador = servico.prestador || {};
      const categoria = servico.categoria || {};

      console.log("🔹 Prestador do serviço:", prestador);

      const contatosAtivos = contatosRes.data.filter(
        c => Number(c.prestador_id) === Number(prestador.id) && c.statusContato === "ATIVO"
      );

      const feedbacksPrestador = feedbacksRes.data.filter(
        f => Number(f.prestador_id) === Number(prestador.id) && f.status_feedback === "ATIVO"
      );

      console.log("🔹 Feedbacks filtrados para este prestador:", feedbacksPrestador);

      const cardData = {
        prestadorNome: prestador.nome || "",
        servicoDescricao: servico.descricao || "",
        categoria: categoria.nome || "",
        cidade: prestador.cidade || "",
        uf: prestador.uf || "",
        contatos: {
          whatsapp: contatosAtivos.find(c => c.link?.includes("wa.me"))?.link || "",
          instagram: contatosAtivos.find(c => c.link?.includes("instagram.com"))?.link || "",
          facebook: contatosAtivos.find(c => c.link?.includes("facebook.com"))?.link || ""
        },
        foto: prestador.foto || ProfileImg
      };

      setCard(cardData);
      setFeedbacks(feedbacksPrestador);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao buscar dados do prestador:", error);
      setLoading(false);
    }
  };

  fetchCard();
}, []);



  if (loading) return <p>Carregando dados do prestador...</p>;
  if (!card) return <p>Card não encontrado.</p>;

  return (
    <div className="prestview-page">
      <HeaderSwitcher />
      <div className="prestview-container">

        {/* Foto do prestador */}
        <img src={card.foto} alt="Prestador" className="prestview-photo" />

        {/* Nome */}
        <div className="prestview-field">
          <label className="prestview-label"><IoPersonCircleOutline className="icon" /> Nome</label>
          <input type="text" className="prestview-input" value={card.prestadorNome} readOnly />
        </div>

        {/* Descrição */}
        <div className="prestview-field">
          <label className="prestview-label"><FaList className="icon" /> Descrição</label>
          <textarea className="prestview-input" value={card.servicoDescricao} readOnly />
        </div>

        {/* Formas de contato */}
        <div className="prestview-field">
          <label className="prestview-label"><IoIosCall className="icon" /> Contatos</label>
          <div className="prestview-contacts">
            <input type="text" placeholder="WhatsApp" value={card.contatos.whatsapp} readOnly className="prestview-input" />
            <input type="text" placeholder="Instagram" value={card.contatos.instagram} readOnly className="prestview-input" />
            <input type="text" placeholder="Facebook" value={card.contatos.facebook} readOnly className="prestview-input" />
          </div>
        </div>

        {/* Cidade + Estado */}
        <div className="prestview-field">
          <label className="prestview-label"><FaMapMarkerAlt className="icon" /> Região</label>
          <input type="text" value={`${card.cidade} - ${card.uf}`} readOnly className="prestview-input" />
        </div>

        {/* Categoria */}
        <div className="prestview-field">
          <label className="prestview-label"><FaList className="icon" /> Categoria</label>
          <input type="text" value={card.categoria} readOnly className="prestview-input" />
        </div>

        {/* Foto produto */}
        <div className="prestview-field">
          <label className="prestview-label"><IoMdImage className="icon" /> Foto serviço</label>
          <img src={InputImg} alt="Imagem do serviço" className="prestview-image-2" />
        </div>

        {/* Feedbacks */}
          <h2 className="feedback-title">Feedbacks</h2>
          <div className="prestview-feedbacks">
            {feedbacks.length === 0 ? (
              <p>Nenhum feedback carregado.</p>
            ) : (
              feedbacks.map((fb) => (
                <div 
                  key={fb.id} 
                  className={`feedback-card ${fb.tipo_feedback === 'FEEDBACK' ? 'feedback' : 'denuncia'}`}
                >
                  <h4>{fb.titulo}</h4>
                  <p>{fb.descricao}</p>
                  {fb.nota !== undefined && (
                    <p><strong>Nota:</strong> {fb.nota}⭐</p>
                  )}
                </div>
              ))
            )}
          </div>


        {/* Botões */}
        <div className="prestview-buttons">
          <button className="btn-edit">Inativar conta</button>
          <button className="btn-delete">Ativar conta</button>
        </div>
      </div>
    </div>
  );
};

export default DevViewPrestador;
