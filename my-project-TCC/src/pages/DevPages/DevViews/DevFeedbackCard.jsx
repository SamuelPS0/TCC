import React from "react";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { breakLineEveryNChars } from "../../../utils/formatFeedbackText";
import "./DevFeedbackCard.css";

const feedbackAvatarThemes = [
  { background: "#ffe1d9", color: "#ff4b2f" },
  { background: "#dff7ec", color: "#14a85f" },
  { background: "#dcecff", color: "#1f76d2" },
  { background: "#f0e4ff", color: "#8a3ffc" },
  { background: "#fff3d6", color: "#d98700" },
  { background: "#dff8fb", color: "#008a99" },
  { background: "#ffe0ef", color: "#d63384" },
];

const normalizeFeedbackRating = (nota) => {
  const rating = Number(nota);

  if (!Number.isFinite(rating) || rating <= 0) {
    return null;
  }

  return Math.min(5, Math.max(1, Math.round(rating)));
};

const formatFeedbackDate = (dateValue) => {
  if (!dateValue) return "Há pouco tempo";

  const feedbackDate = new Date(dateValue);

  if (Number.isNaN(feedbackDate.getTime())) {
    return "Há pouco tempo";
  }

  const diffInMs = Date.now() - feedbackDate.getTime();
  const diffInMinutes = Math.max(0, Math.floor(diffInMs / 60000));

  if (diffInMinutes < 1) return "Agora";
  if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `Há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 30) {
    return `Há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths < 12) {
    return `Há ${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);

  return `Há ${diffInYears} ${diffInYears === 1 ? "ano" : "anos"}`;
};

const getFeedbackAvatarTheme = (identifier = "Usuário") => {
  const normalizedIdentifier = String(identifier || "Usuário");
  const hash = normalizedIdentifier.split("").reduce((total, char) => {
    return total + char.charCodeAt(0);
  }, 0);

  return feedbackAvatarThemes[hash % feedbackAvatarThemes.length];
};

const getFeedbackInitial = (name = "Usuário") => {
  const trimmedName = String(name || "Usuário").trim();

  return trimmedName.charAt(0).toUpperCase() || "U";
};

const renderFeedbackStars = (nota) => {
  const rating = normalizeFeedbackRating(nota) || 0;

  return Array.from({ length: 5 }, (_, index) => (
    <FaStar
      key={index}
      className={
        index < rating
          ? "dev-feedback-card-star dev-feedback-card-star--active"
          : "dev-feedback-card-star"
      }
    />
  ));
};

const getFeedbackTypeLabel = (tipoFeedback) =>
  tipoFeedback === "FEEDBACK" ? "Feedback" : "Denúncia";

const DevFeedbackCard = ({ feedback, authorName, onToggleStatus }) => {
  const isFeedback = feedback?.tipoFeedback === "FEEDBACK";
  const isInactive = feedback?.statusFeedback === "INATIVO";
  const feedbackRating = normalizeFeedbackRating(feedback?.nota);
  const displayName = authorName || feedback?.nomeUsuario || `Usuário #${feedback?.usuarioId}`;
  const avatarTheme = getFeedbackAvatarTheme(feedback?.usuarioId || displayName);

  return (
    <article
      className={`dev-feedback-card ${
        isFeedback ? "dev-feedback-card--feedback" : "dev-feedback-card--denuncia"
      } ${isInactive ? "dev-feedback-card--inactive" : ""}`}
    >
      <div className="dev-feedback-card__header">
        <div className="dev-feedback-card__user-group">
          <div
            className="dev-feedback-card__avatar"
            style={{
              "--dev-feedback-avatar-bg": avatarTheme.background,
              "--dev-feedback-avatar-color": avatarTheme.color,
            }}
            aria-hidden="true"
          >
            {getFeedbackInitial(displayName)}
          </div>

          <div className="dev-feedback-card__user-info">
            <div className="dev-feedback-card__name-row">
              <h3 className="dev-feedback-card__name">{displayName}</h3>
              <FaCheckCircle className="dev-feedback-card__verified-icon" />
            </div>

            <div className="dev-feedback-card__meta-row">
              <span
                className={`dev-feedback-card__type ${
                  isFeedback
                    ? "dev-feedback-card__type--feedback"
                    : "dev-feedback-card__type--denuncia"
                }`}
              >
                {getFeedbackTypeLabel(feedback?.tipoFeedback)}
              </span>

              {isFeedback && (
                feedbackRating ? (
                  <span className="dev-feedback-card__stars">
                    {renderFeedbackStars(feedbackRating)}
                  </span>
                ) : (
                  <span className="dev-feedback-card__without-rating">Sem nota</span>
                )
              )}

              <span className="dev-feedback-card__dot" aria-hidden="true">
                •
              </span>

              <span className="dev-feedback-card__date">
                {formatFeedbackDate(feedback?.dataCadastro)}
              </span>
            </div>
          </div>
        </div>

        <label
          className="dev-feedback-card__switch"
          title={
            feedback?.statusFeedback === "ATIVO"
              ? "Desativar feedback"
              : "Ativar feedback"
          }
        >
          <input
            type="checkbox"
            checked={feedback?.statusFeedback === "ATIVO"}
            onChange={() => onToggleStatus(feedback)}
          />
          <span className="dev-feedback-card__slider" />
        </label>
      </div>

      <h4 className="dev-feedback-card__title">
        {feedback?.titulo || "Sem título"}
      </h4>

      <p className="dev-feedback-card__description">
        {breakLineEveryNChars(feedback?.descricao || "Sem descrição", 105)}
      </p>
    </article>
  );
};

export default DevFeedbackCard;
