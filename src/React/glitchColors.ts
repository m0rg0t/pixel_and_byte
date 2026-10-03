const DEFAULT_COLORS = ["#5e4491", "#A476FF", "#241a38"];

/** Smooth animation frames emit rgb(), so the next frame must accept it too. */
export function colorToRgb(
  value: string,
): { r: number; g: number; b: number } | null {
  const rgb = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/.exec(value);
  if (rgb) {
    const [r, g, b] = rgb.slice(1).map(Number);
    return [r, g, b].every((channel) => channel >= 0 && channel <= 255)
      ? { r, g, b }
      : null;
  }
  const expanded = value.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (_match, r, g, b) => `${r}${r}${g}${g}${b}${b}`,
  );
  const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);
  return hex
    ? {
        r: parseInt(hex[1], 16),
        g: parseInt(hex[2], 16),
        b: parseInt(hex[3], 16),
      }
    : null;
}

export function normalizePalette(values: string[]): string[] {
  const valid = values.filter((value) => colorToRgb(value) !== null);
  return valid.length ? valid : DEFAULT_COLORS;
}
