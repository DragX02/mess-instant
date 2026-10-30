// Palette Helix (thème sombre)
export const colors = {
  bg: "#0D0C11",
  card: "#15141A",
  cardBorder: "#2B2A35",
  panel: "#1E1D25",
  panelBorder: "#2B2A35",
  accent: "#F2704B",
  accentSoft: "rgba(242, 112, 75, 0.16)",
  accentSoftSolid: "#3A2320", // équivalent opaque d'accentSoft sur panel (Outlook)
  white: "#FFFFFF",
  text: "#C9C5D3",
  textSecondary: "#B4B0C1",
  textMuted: "#8E8A9B",
}

// Polices web non fiables en email : le fallback doit rester propre
export const fonts = {
  heading: "'Bricolage Grotesque', 'Segoe UI', Helvetica, Arial, sans-serif",
  body: "Manrope, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace",
}

// Styles réutilisables (tous inline, sans flexbox ni grid)
export const darkEmailStyles = {
  paragraph: {
    margin: "0 0 24px 0",
    fontFamily: fonts.body,
    fontSize: "16px",
    lineHeight: "26px",
    color: colors.text,
  } as const,
  small: {
    margin: "0",
    fontFamily: fonts.body,
    fontSize: "14px",
    lineHeight: "22px",
    color: colors.textSecondary,
  } as const,
  panelLabel: {
    margin: "0 0 6px 0",
    fontFamily: fonts.heading,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: 700,
    letterSpacing: "1.6px",
    textTransform: "uppercase",
    color: colors.textMuted,
  } as const,
  panelValue: {
    margin: "0",
    fontFamily: fonts.heading,
    fontSize: "18px",
    lineHeight: "26px",
    fontWeight: 600,
    color: colors.white,
  } as const,
  link: {
    color: colors.accent,
    textDecoration: "none",
  } as const,
  monospace: {
    margin: "0",
    fontFamily: fonts.mono,
    fontSize: "13px",
    lineHeight: "20px",
    color: colors.text,
    wordBreak: "break-all",
  } as const,
}

// Attribut HTML bgcolor (Outlook ignore parfois background-color) : non typé sur <td> par React
export const bgAttr = (color: string) => ({ bgcolor: color }) as Record<string, string>

// Outlook.com (mode sombre) réécrit background-color en !important mais ne touche pas aux images :
// un dégradé de la même couleur garde le fond intact.
export const solid = (color: string) => ({ backgroundImage: `linear-gradient(${color}, ${color})` })
