import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomeListSearchBar.css";

export default function HomeListSearchBar({
  initialCategory = "",
  initialLocation = "",
  onSearch,
}) {
  const [categorias, setCategorias] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/categoria");
        setCategorias(response.data || []);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        setCategorias([]);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    if (location.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
        );

        const data = await response.json();

        const filteredCities = data
          .filter((city) =>
            city.nome.toLowerCase().includes(location.toLowerCase())
          )
          .slice(0, 5)
          .map((city) => ({
            display: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`,
          }));

        setSuggestions(filteredCities);
      } catch (error) {
        console.error("Erro ao carregar sugestões de cidades:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [location]);

  const handleSelectSuggestion = (city) => {
    setLocation(city.display);
    setSuggestions([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedCategory = category.trim();
    const trimmedLocation = location.trim();

    if (onSearch) {
      onSearch({
        category: trimmedCategory,
        location: trimmedLocation,
      });
    }

    const params = new URLSearchParams();

    if (trimmedCategory) {
      params.append("category", trimmedCategory);
    }

    if (trimmedLocation) {
      params.append("location", trimmedLocation);
    }

    navigate(`/home-list${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="homelist-searchbar" aria-label="Buscar prestadores">
      <form
        className="homelist-searchbar__form"
        role="search"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="homelist-searchbar__field">
          <label
            htmlFor="homelist-searchbar-category"
            className="homelist-searchbar__label"
          >
            O que você precisa?
          </label>

          <select
            id="homelist-searchbar-category"
            className="homelist-searchbar__input homelist-searchbar__select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Todas as categorias</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id || categoria.nome}
                value={categoria.nome}
              >
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="homelist-searchbar__divider" aria-hidden="true" />

        <div className="homelist-searchbar__field homelist-searchbar__field--location">
          <label
            htmlFor="homelist-searchbar-location"
            className="homelist-searchbar__label"
          >
            Onde?
          </label>

          <input
            id="homelist-searchbar-location"
            className="homelist-searchbar__input"
            type="text"
            placeholder="Digite a cidade"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          {suggestions.length > 0 && (
            <ul className="homelist-searchbar__suggestions">
              {suggestions.map((city) => (
                <li
                  key={city.display}
                  className="homelist-searchbar__suggestion"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelectSuggestion(city)}
                >
                  {city.display}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="homelist-searchbar__button">
          Buscar
        </button>
      </form>
    </section>
  );
}