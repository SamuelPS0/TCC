import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

// Lista fixa de categorias para o select
const categories = [
  "Comidas Prontas",
  "Lanches e Fast Food",
  "Doces e Sobremesas",
  "Padaria e Confeitaria",
  "Sucos naturais",
  "Drinks artesanais",
  "Cafés e chás especiais",
  "Saudável e Fitness",
  "Comida italiana",
  "Comida japonesa",
  "Comida nordestina",
  "Comida árabe",
  "Comida mexicana",
  "Buffet para festas",
];

export default function SearchBar({
  onSearch,           // Função callback para quando o usuário busca
  shouldNavigate = false,  // Define se o componente deve navegar após busca
  initialCategory = '',    // Valor inicial para categoria
  initialLocation = '',    // Valor inicial para localização
}) {
  // Estado para armazenar a categoria selecionada
  const [category, setCategory] = useState(initialCategory);
  // Estado para armazenar o texto digitado na localização
  const [location, setLocation] = useState(initialLocation);
  // Estado para armazenar sugestões de cidades baseadas na busca
  const [suggestions, setSuggestions] = useState([]);
  // Hook para navegação programada do React Router
  const navigate = useNavigate();

  // Atualiza o estado category se a prop initialCategory mudar
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  // Atualiza o estado location se a prop initialLocation mudar
  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  // useEffect que roda sempre que o location muda, para buscar sugestões de cidades
  useEffect(() => {
    // Se o texto digitado tem menos de 3 caracteres, limpa sugestões e retorna
    if (location.length < 3) {
      setSuggestions([]);
      return;
    }

    // Função que busca cidades da API do IBGE e filtra pelos caracteres digitados
    const fetchCities = async () => {
      try {
          // Faz uma requisição HTTP do tipo GET para a API pública do IBGE, buscando
          // a lista completa de municípios do Brasil.
          const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);

          // Converte a resposta da requisição para JSON, que será um array de objetos
          // representando cada município, com informações detalhadas (nome e Estado).
          const data = await res.json();


        // Filtra cidades que contenham o texto digitado (case insensitive)
          // Filtra o array de cidades para encontrar aquelas cujo nome contenha
          // o texto digitado pelo usuário (ignorando maiúsculas/minúsculas).
          const filtered = data
            .filter(city => city.nome.toLowerCase().includes(location.toLowerCase()))
            // Limita o resultado a no máximo 5 cidades para não sobrecarregar a lista de sugestões.
            .slice(0, 5)
            // Mapeia cada cidade filtrada para um novo objeto contendo apenas a propriedade
            // "display", que é uma string com o nome da cidade e a sigla do estado correspondente.
            .map(city => ({
              display: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`, // Ex: "São Paulo - SP"
            }));


        setSuggestions(filtered); // Atualiza sugestões
      } catch {
        setSuggestions([]); // Em caso de erro, limpa sugestões
      }
    };

    // Aplica debounce de 300ms para evitar chamadas excessivas na API
    // para não sobrecarregar o site e evitar lentidão no sistema
    const debounce = setTimeout(() => fetchCities(), 300);
    return () => clearTimeout(debounce);
  }, [location]);

  // Quando o usuário clica em uma sugestão, atualiza o input e limpa sugestões
  const handleSelectSuggestion = (cidade) => {
    setLocation(cidade.display);
    setSuggestions([]);
  };

  // Função para enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Chama a função de busca passada como prop, com os dados atuais
    if (onSearch) {
      onSearch({ category, location });
    }

    // Se foi configurado para navegar, gera os parâmetros e navega para a página lista
    if (shouldNavigate) {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (location) params.append('location', location);

      navigate('/home-list?' + params.toString());
    }
  };

  return (
    <section className="container-searchbar" aria-label="Barra de busca">
      <div className="search-wrapper">
        <form
          className="input-group horizontal"
          role="search"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Select para categoria */}
          <div className="input-wrapper">
            <label htmlFor="search-keyword" className="input-label">
              O que?
            </label>
            <select
              id="search-keyword"
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Input para localização */}
          <div className="input-wrapper input-wrapper-right">
            <label htmlFor="search-location" className="input-label">
              Onde?
            </label>
            <input
              id="search-location"
              type="text"
              placeholder="Digite a cidade"
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Botão para buscar */}
          <button type="submit" className="search-button">
            Buscar
          </button>
        </form>
      </div>

      {/* Lista de sugestões exibida abaixo do input de localização */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((cidade, i) => (
            <li
              key={i}
              onMouseDown={(e) => e.preventDefault()} // Previne o blur no input ao clicar
              onClick={() => handleSelectSuggestion(cidade)} // Seleciona a sugestão
              className="suggestion-item"
            >
              {cidade.display}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
