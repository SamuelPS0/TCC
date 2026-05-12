import React, { useMemo, useState } from "react";
import { MdOutlineStarBorder } from "react-icons/md";
import { useLocation } from "react-router-dom";
import HeaderSwitcher from "../../Components/HeaderSwitcher";
import Cards from "../../Components/Cards/Cards";
import HomeListSearchBar from "./HomeListSearchBar";
import "./HomeList.css";

const ratingFilterOptions = [
  {
    label: "Todas as avaliações",
    value: "",
  },
  {
    label: "Acima de 4 estrelas",
    value: "4",
  },
  {
    label: "Acima de 3 estrelas",
    value: "3",
  },
  {
    label: "Acima de 2 estrelas",
    value: "2",
  },
  {
    label: "Acima de 1 estrela",
    value: "1",
  },
];

const HomeList = () => {
  const location = useLocation();
  const [minRating, setMinRating] = useState("");

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const category = params.get("category") || "";
  const city = params.get("location") || "";

  return (
    <main className="homelist-page">
      <div className="homelist-shell">
        <span className="homelist-breadcrumb">EncontrarServiços</span>

        <HeaderSwitcher />

        <section className="homelist-hero" aria-label="Busca de prestadores">
          <div className="homelist-hero__content">
            <div className="homelist-hero__text">
              <h1>Encontre os melhores prestadores de serviços</h1>
              <p>
                Pesquise, compare e escolha os melhores profissionais próximos a
                você!
              </p>
            </div>

            <HomeListSearchBar
              initialCategory={category}
              initialLocation={city}
            />
          </div>
        </section>

        <section className="homelist-results" aria-label="Lista de prestadores">
          <div className="homelist-filters">
            <label className="homelist-rating-filter">
              <MdOutlineStarBorder className="homelist-rating-filter__icon" />

              <select
                className="homelist-rating-filter__select"
                value={minRating}
                onChange={(event) => setMinRating(event.target.value)}
                aria-label="Filtrar por avaliação média"
              >
                {ratingFilterOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Cards
            filter={{
              category,
              city,
              minRating,
            }}
          />
        </section>
      </div>
    </main>
  );
};

export default HomeList;