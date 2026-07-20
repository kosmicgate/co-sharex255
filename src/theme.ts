export const colors = {
  background: '#efece0',
  panel: '#e7e2cd',
  white: '#ffffff',
  ink: '#1c1c1a',
  mutedDark: '#5c5647',
  mutedLight: '#8b8370',
  borderDashed: '#d3cbae',
  borderDashedAlt: '#c8bfa0',
  orange: '#dd8a3a',
  orangeLight: '#f3dcae',
  teal: '#2f7d6e',
} as const;

export const fonts = {
  headline: "'Archivo Black', sans-serif",
  body: "'Archivo', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

export const radii = {
  sm: '6px',
  tab: '7px',
  card: '8px',
  pill: '18px',
  pillLg: '22px',
} as const;

export const borders = {
  main: `1.5px solid ${colors.ink}`,
  accentTop: (color: string) => `4px solid ${color}`,
  dashed: `2px dashed ${colors.ink}`,
  dashedMuted: `1px dashed ${colors.borderDashed}`,
} as const;
