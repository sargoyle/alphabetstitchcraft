export const tokens = {
  colour: {
    background: "#06100e",
    backgroundRaised: "#0b1714",
    surface: "rgba(255, 255, 255, 0.08)",
    surfaceRaised: "rgba(255, 255, 255, 0.13)",
    text: "#f5f7ef",
    textMuted: "#b8c5bd",
    border: "rgba(255, 255, 255, 0.14)",
    accent: "#10b981",
    accentSoft: "rgba(16, 185, 129, 0.18)",
    accentWarm: "#f3b35a",
    paper: "#f7f0e3",
    paperLine: "#d8ccba",
    filled: "#071b16",
    success: "#45f6bd",
    warning: "#f3b35a",
    error: "#ff7777"
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    headingWeight: 800,
    bodyWeight: 500,
    labelWeight: 800
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "18px",
    xl: "24px",
    "2xl": "32px"
  },
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    card: "8px",
    modal: "12px"
  },
  border: {
    default: "1px solid rgba(255, 255, 255, 0.14)",
    strong: "1px solid rgba(255, 255, 255, 0.24)",
    focus: "3px solid rgba(69, 246, 189, 0.72)"
  },
  shadow: {
    panel: "0 28px 90px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
    card: "0 18px 48px rgba(0, 0, 0, 0.28)",
    modal: "0 32px 100px rgba(0, 0, 0, 0.48)"
  },
  zIndex: {
    header: 10,
    toast: 30,
    modal: 50
  },
  card: {
    gameCardWidth: "150px",
    gameCardAspectRatio: "5 / 7",
    compactCardWidth: "96px",
    handGap: "10px"
  },
  layout: {
    panelWidth: "360px",
    sidebarWidth: "280px",
    contentMaxWidth: "none",
    gap: "22px"
  },
  state: {
    disabledOpacity: 0.5,
    legalMove: "0 0 0 3px rgba(69, 246, 189, 0.34)",
    illegalMove: "0 0 0 3px rgba(255, 119, 119, 0.34)",
    selected: "0 0 0 3px rgba(243, 179, 90, 0.48)"
  }
} as const;

export type DesignTokens = typeof tokens;
