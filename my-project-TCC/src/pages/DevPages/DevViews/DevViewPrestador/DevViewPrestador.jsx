import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Para pegar o ID da URL
import HeaderSwitcher from "../../../../Components/HeaderSwitcher";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdImage, IoIosCall } from "react-icons/io";
import { FaMapMarkerAlt, FaList } from "react-icons/fa";
import { toast } from "sonner";
import ProfileImg from "../../../../img/Ellipse.png"; //foto de perfil 1
import ProfileImg2 from "../../../../img/pererinha.png"; //foto de perfil 2
import InputImg from "../../../../img/crosant.png"; // foto de produto 1
import InputImg2 from "../../../../img/bebidas.jpg"; // foto de produto 2
import "./DevViewPrestador.css";

const DevViewPrestador = () => {
  const { prestadorId } = useParams(); // ID do prestador vindo da rota
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [prestador, setPrestador] = useState(null);
  const [statusPrestador, setStatusPrestador] = useState(false);

useEffect(() => {
  const fetchPrestador = async () => {
    try {
      // 1. Busca o prestador pelo ID
      const prestadorRes = await axios.get(`http://localhost:8080/api/v1/prestador/${prestadorId}`);
      const prestadorData = prestadorRes.data;

      if (!prestadorData) {
        toast.error("Prestador não encontrado!");
        setLoading(false);
        return;
      }

      // 2. Busca serviço do prestador (já vem com categoria)
      const servicosRes = await axios.get("http://localhost:8080/api/v1/servico");
      const servico = servicosRes.data.find(s => s.prestador.id === prestadorData.id);

      // 3. Busca contatos ativos
      const contatosRes = await axios.get("http://localhost:8080/api/v1/contato");
      const contatosAtivos = contatosRes.data.filter(
        c => c.prestadorId === prestadorData.id && c.statusContato === "ATIVO"
      );

      // 4. Busca feedbacks ativos
      const feedbacksRes = await axios.get("http://localhost:8080/api/v1/feedback");
      const feedbacksPrestador = feedbacksRes.data.filter(
        f => f.prestadorId === prestadorData.id && f.statusFeedback === "ATIVO"
      );

      // Função que retorna fotos conforme o ID do prestador
      const getFotosPrestador = (id) => {
        if (id === 1) return { perfil: ProfileImg, servico: InputImg };
        if (id === 2) return { perfil: ProfileImg2, servico: InputImg2 };
        return { perfil: ProfileImg, servico: InputImg }; // padrão
      };
      const fotos = getFotosPrestador(prestadorData.id);

      // 5. Monta dados do card
      const cardData = {
        prestadorNome: prestadorData.nome || "",
        servicoDescricao: servico?.descricao || "",
        categoria: servico?.categoria?.nome || "",
        cidade: prestadorData.cidade || "",
        uf: prestadorData.uf || "",
        contatos: {
          whatsapp: contatosAtivos.find(c => c.tipoContato === "WhatsApp")?.link || "",
          instagram: contatosAtivos.find(c => c.tipoContato === "Instagram")?.link || "",
          facebook: contatosAtivos.find(c => c.tipoContato === "Facebook")?.link || "",
        },
        foto: fotos.perfil,
        fotoServico: fotos.servico,
      };

      // 6. Atualiza estados
      setPrestador(prestadorData);
      setStatusPrestador(prestadorData.statusPrestador === "ATIVO");
      setCard(cardData);
      setFeedbacks(feedbacksPrestador);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao carregar prestador:", error);
      toast.error("Erro ao carregar prestador!");
      setLoading(false);
    }
  };

  fetchPrestador();
}, [prestadorId]);











const editarStatusPrestador = async (id, novoStatus) => {
  const statusString = novoStatus ? "ATIVO" : "INATIVO";
  const toastId = toast.loading("Atualizando status...");
  
  try {
      const prestadorRes = await axios.get(`http://localhost:8080/api/v1/prestador/${id}`);
      const prestadorData = prestadorRes.data;
      
      // Busca usuário vinculado pelo nome
      const usuariosRes = await axios.get("http://localhost:8080/api/v1/Usuario");
      const usuarioVinculado = usuariosRes.data.find(
        (u) => Number(u.id) === Number(prestadorData.usuario_id)
      );
      
      
      // Atualiza prestador
      await axios.put(`http://localhost:8080/api/v1/prestador/${id}`, {
        ...prestadorData,
        statusPrestador: statusString,
      });
      
      // Atualiza usuário vinculado, se existir
      if (usuarioVinculado) {
        await axios.put(`http://localhost:8080/api/v1/Usuario/${usuarioVinculado.id}`, {
          ...usuarioVinculado,
          statusUsuario: novoStatus,
        });
      }
      
      setStatusPrestador(novoStatus);
      toast.success(`Prestador ${statusString.toLowerCase()} com sucesso!`, { id: toastId });
    } catch (error) {
      console.error("Erro ao atualizar prestador/usuário:", error);
      toast.error("Erro ao atualizar prestador e/ou usuário!", { id: toastId });
    }
  };
  
  if (loading) return <p>Carregando dados do prestador...</p>;
  if (!card) return <p>Prestador não encontrado.</p>;
  console.log('Dados carregados do prestador: ', card)

  return (
    <div className="prestview-page">
      <HeaderSwitcher />
      <div className="prestview-container">
        <img src={card.foto} alt="Prestador" className="prestview-photo" />

        <div className="prestview-field">
          <label className="prestview-label">
            <IoPersonCircleOutline className="icon" /> Nome
          </label>
          <input type="text" className="prestview-input" value={card.prestadorNome} readOnly />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <FaList className="icon" /> Descrição
          </label>
          <textarea className="prestview-input" value={card.servicoDescricao} readOnly />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <IoIosCall className="icon" /> Contatos
          </label>
          <div className="prestview-contacts">
            <input type="text" placeholder="WhatsApp" value={card.contatos.whatsapp} readOnly className="prestview-input" />
            <input type="text" placeholder="Instagram" value={card.contatos.instagram} readOnly className="prestview-input" />
            <input type="text" placeholder="Facebook" value={card.contatos.facebook} readOnly className="prestview-input" />
          </div>
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <FaMapMarkerAlt className="icon" /> Região
          </label>
          <input type="text" value={`${card.cidade} - ${card.uf}`} readOnly className="prestview-input" />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <FaList className="icon" /> Categoria
          </label>
          <input type="text" value={card.categoria} readOnly className="prestview-input" />
        </div>

        <div className="prestview-field">
          <label className="prestview-label">
            <IoMdImage className="icon" /> Foto serviço
          </label>
          <img src={card.fotoServico} alt="Imagem do serviço" className="prestview-image-2" />
        </div>

        <h2 className="feedback-title">Feedbacks & Ocorrências</h2>
        <div className="prestview-feedbacks">
          {feedbacks.length === 0 ? (
            <p>Nenhum feedback carregado.</p>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb.id}
                className={`prestview-feedback-card ${fb.tipoFeedback === "FEEDBACK" ? "feedback" : "denuncia"}`}
              >
                <h4>{fb.titulo}</h4>
                <p>{fb.descricao}</p>
                {fb.nota !== undefined && <p><strong>Nota:</strong> {fb.nota}⭐</p>}
              </div>
            ))
          )}
        </div>

        {prestador && (
          <div className="prestview-buttons">
            <button
              className="btn-delete"
              onClick={() => editarStatusPrestador(prestador.id, true)}
              disabled={statusPrestador}
            >
              Ativar conta
            </button>
            <button
              className="btn-edit"
              onClick={() => editarStatusPrestador(prestador.id, false)}
              disabled={!statusPrestador}
            >
              Inativar conta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevViewPrestador;
