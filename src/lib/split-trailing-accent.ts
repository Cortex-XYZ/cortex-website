export function splitTrailingAccent(text: string, accent = ".") {
  if (accent.length === 0 || !text.endsWith(accent)) {
    return { text, accent: null };
  }

  return {
    text: text.slice(0, -accent.length),
    accent,
  };
}
