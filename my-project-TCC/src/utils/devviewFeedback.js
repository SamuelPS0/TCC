export const getNomeFeedback = (feedback = {}, nomesUsuarios = {}) =>
  feedback.nomeUsuario ||
  nomesUsuarios[Number(feedback.usuarioId)] ||
  `Usuário #${feedback.usuarioId || ""}`.trim();

export const getInicialFeedback = (nome = "") =>
  nome.trim().charAt(0).toUpperCase() || "?";

export const formatNotaFeedback = (nota) => {
  const notaNumerica = Number(nota);

  if (!notaNumerica) {
    return "Sem nota";
  }

  return `${notaNumerica} estrela${notaNumerica > 1 ? "s" : ""}`;
};

export const formatTempoFeedback = (dataCadastro) => {
  if (!dataCadastro) return "Agora";

  const data = new Date(dataCadastro);
  if (Number.isNaN(data.getTime())) return "Agora";

  const diferencaMinutos = Math.max(0, Math.floor((Date.now() - data.getTime()) / 60000));

  if (diferencaMinutos < 1) return "Agora";
  if (diferencaMinutos < 60) return `Há ${diferencaMinutos} min`;

  const diferencaHoras = Math.floor(diferencaMinutos / 60);
  if (diferencaHoras < 24) return `Há ${diferencaHoras} h`;

  const diferencaDias = Math.floor(diferencaHoras / 24);
  if (diferencaDias < 30) return `Há ${diferencaDias} d`;

  return data.toLocaleDateString("pt-BR");
};


export const getNotaInteira = (nota) => {
  const notaNumerica = Math.round(Number(nota));
  if (!Number.isFinite(notaNumerica) || notaNumerica < 1) return 0;
  return Math.min(5, notaNumerica);
};
