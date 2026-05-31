import React, { useMemo, useState } from "react";
import { FaCheck, FaChevronDown, FaRegStar, FaStar } from "react-icons/fa";
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
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const category = params.get("category") || "";
  const city = params.get("location") || "";
  const selectedRatingOption =
    ratingFilterOptions.find((option) => option.value === minRating) ||
    ratingFilterOptions[0];

  const handleSelectRatingOption = (value) => {
    setMinRating(value);
    setIsRatingDropdownOpen(false);
  };

  const renderStars = (filledCount = 0) =>
    Array.from({ length: 5 }).map((_, index) =>
      index < filledCount ? (
        <FaStar key={`filled-${filledCount}-${index}`} />
      ) : (
        <FaRegStar key={`empty-${filledCount}-${index}`} />
      )
    );

  return (
    <main className="homelist-page">
      <div className="homelist-shell">
                <HeaderSwitcher />

        <section className="homelist-hero" aria-label="Busca de prestadores">
          <div className="homelist-hero__content">
            <div className="homelist-hero__text">
              <h1>Encontre os melhores prestadores da sua região</h1>
              <p>Compare avaliações, descubra serviços e escolha com confiança.</p>
            </div>
                        <HomeListSearchBar
              initialCategory={category}
              initialLocation={city}
            />
          </div>
        </section>

        <section className="homelist-results" aria-label="Lista de prestadores">
          <div className="homelist-filters">
            <div className="homelist-rating-filter">
              <button
                type="button"
                className="homelist-rating-filter__trigger"
                onClick={() => setIsRatingDropdownOpen((prev) => !prev)}
                aria-label="Filtrar por avaliação média"
                aria-expanded={isRatingDropdownOpen}
              >
                <span className="homelist-rating-filter__trigger-content">
                  <FaRegStar className="homelist-rating-filter__icon" />
                  <span>{selectedRatingOption.label}</span>
                </span>
                <FaChevronDown className="homelist-rating-filter__chevron" />
              </button>

              {isRatingDropdownOpen && (
                <div className="homelist-rating-filter__menu" role="listbox">
                  {ratingFilterOptions.map((option) => {
                    const isSelected = option.value === minRating;
                    const filledStars = Number(option.value) || 0;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        className={`homelist-rating-filter__option ${isSelected ? "is-selected" : ""}`}
                        onClick={() => handleSelectRatingOption(option.value)}
                      >
                        <div className="homelist-rating-filter__option-content">
                          {filledStars > 0 ? (
                            <span className="homelist-rating-filter__stars">
                              {renderStars(filledStars)}
                            </span>
                          ) : (
                            <FaRegStar className="homelist-rating-filter__option-main-icon" />
                          )}
                          <span>{option.label}</span>
                        </div>
                        {isSelected && <FaCheck className="homelist-rating-filter__check" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
