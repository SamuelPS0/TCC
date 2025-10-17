import {React, useState, useEffect} from 'react'
import {toast} from 'sonner'
import axios from 'axios'

const Cards = () => {  
    //Tabela serviço
    const [servicoFoto, setServicoFoto] = useState(''); //Foto do produto
    const [servicoNome, setServicoNome] = useState('');
    const [servicoDescricao, setServicoDescricao] = useState('');

const CarregarServico = async () => {
  try {
    const { data } = await axios.get('http://localhost:8080/api/v1/servico');
    const servico = data[0];

    console.log("Serviço:", {
      nome: servico.nome,
      descricao: servico.descricao,
      foto: servico.foto
    });

    setServicoFoto(servico.foto);
    setServicoNome(servico.nome);
    setServicoDescricao(servico.descricao);
  } catch (error) {
    console.log("Erro ao carregar serviço:", error);
  }
};


    //Tabela contato
    const [contatoTipo, setContatoTipo] = useState('');
    const [contatoLink, setContatoLink] = useState('');

const CarregarContato = async () => {
  try {
    const { data } = await axios.get('http://localhost:8080/api/v1/contato');
    const contato = data[0];

    console.log("Contato:", {
      tipo: contato.tipo,
      link: contato.link
    });

    setContatoTipo(contato.tipo);
    setContatoLink(contato.link);
  } catch (error) {
    console.log("Erro ao carregar contato:", error);
  }
};


    //Tabela usuario
    const [usuarioFoto, setUsuarioFoto] = useState('');

const CarregarUsuario = async () => {
  try {
    const { data } = await axios.get('http://localhost:8080/api/v1/Usuario');
    const usuario = data[0];

    console.log("Usuário:", {
      id: usuario.id,
      foto: usuario.foto
    });

    setUsuarioFoto(usuario.foto);
  } catch (error) {
    console.log("Erro ao carregar usuário:", error);
  }
};



    //Tabela feedback -> Resgatar Itens - GET
    const [feedbackTitulo, setFeedbackTitulo] = useState('');
    const [feedbackDescricao, setFeedbackDescricao] = useState('');
    const [feedbackTipo, setFeedbackTipo] = useState('');

const CarregarFeedback = async () => {
  try {
    const { data } = await axios.get('http://localhost:8080/api/v1/feedback');
    const feedback = data[0];

    console.log("Feedback:", {
      titulo: feedback.titulo,
      descricao: feedback.descricao,
      tipo: feedback.tipo
    });

    setFeedbackTitulo(feedback.titulo);
    setFeedbackDescricao(feedback.descricao);
    setFeedbackTipo(feedback.tipo);
  } catch (error) {
    console.log("Erro ao carregar feedback:", error);
  }
};

    //Tabela categoria
    const [categoria, setCategoria] = useState('');

    const CarregarCategoria = async () => {
  try {
    const { data } = await axios.get('http://localhost:8080/api/v1/categoria');
    const categoria = data[0];

    console.log("categoria:", {
      nome: categoria.nome,
    });

    setCategoria(categoria.nome);
  } catch (error) {
    console.log("Erro ao carregar categoria:", error);
  }
};

    //Tabela Regiao
    const [cidade, setCidade] = useState ('');
    const [uf, setUf] = useState ('');
    const CarregarRegiao = async () => {
        try{
            const {data} = await axios.get('http://localhost:8080/api/v1/regiao');
            const regiao = data[0];

            console.log('Regiao: ',{
                cidade: regiao.cidade,
                uf: regiao.uf
            });
            setCidade(regiao.cidade);
            setUf(regiao.uf);
        }catch(error){
            console.log("Erro ao carregar regiao:",error)
        }
    };


useEffect(() => {
  CarregarServico();
  CarregarContato();
  CarregarUsuario();
  CarregarFeedback();
  CarregarCategoria();
  CarregarRegiao();
}, []);


        //Tabela feedback -> Postar Itens - POST
    const [feedbackTituloPost, setFeedbackTituloPost] = useState('');
    const [feedbackDescricaoPost, setFeedbackDescricaoPost] = useState('');
    const [feedbackTipoPost, setFeedbackTipoPost] = useState('');

return (
  <div className="p-4">
    <h2 className="text-xl font-bold mb-4">Serviço</h2>
    <p><strong>Nome:</strong> {servicoNome}</p>
    <p><strong>Descrição:</strong> {servicoDescricao}</p>
    <p><strong>Categoria:</strong> {categoria}</p>
    <p><strong>regiao:</strong> `{cidade} - {uf}`</p>

    <h2 className="text-xl font-bold mt-6 mb-2">Feedback</h2>
    <p><strong>Título:</strong> {feedbackTitulo}</p>
    <p><strong>Descrição:</strong> {feedbackDescricao}</p>
    <p><strong>Tipo:</strong> {feedbackTipo}</p>
  </div>
);

}

export default Cards