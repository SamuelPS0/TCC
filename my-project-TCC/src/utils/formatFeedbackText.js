export const breakLineEveryNChars = (text, maxChars = 70) => {
  if (!text || typeof text !== "string") return "";

  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  const wrappedLines = lines.flatMap((line) => {
    if (line.length <= maxChars) return [line];

    const chunks = [];
    for (let i = 0; i < line.length; i += maxChars) {
      chunks.push(line.slice(i, i + maxChars));
    }
    return chunks;
  });

  return wrappedLines.join("\n");
};