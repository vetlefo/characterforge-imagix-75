import { ColorPalette, Typography, Spacing } from "./types";

export const defaultPalettes: ColorPalette[] = [
  {
    id: "default-dark",
    name: "Default Dark",
    colors: {
      primary: "#3b82f6",
      secondary: "#1e293b",
      accent: "#8b5cf6",
      background: "#0F0F23",
      foreground: "#ffffff",
      muted: "#334155",
      border: "#1e293b"
    }
  },
  {
    id: "purple-dream",
    name: "Purple Dream",
    colors: {
      primary: "#8b5cf6",
      secondary: "#7e69ab",
      accent: "#d946ef",
      background: "#1A1F2C",
      foreground: "#ffffff",
      muted: "#6e59a5",
      border: "#2A2A4A"
    }
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    colors: {
      primary: "#0ea5e9",
      secondary: "#0c4a6e",
      accent: "#06b6d4",
      background: "#0F172A",
      foreground: "#f1f5f9",
      muted: "#1e40af",
      border: "#1e3a8a"
    }
  },
  {
    id: "forest-green",
    name: "Forest Green",
    colors: {
      primary: "#10b981",
      secondary: "#064e3b",
      accent: "#34d399",
      background: "#111827",
      foreground: "#f1f5f9",
      muted: "#065f46",
      border: "#065f46"
    }
  }
];

export const defaultTypography: Typography[] = [
  {
    id: "modern-sans",
    name: "Modern Sans",
    fontFamily: "Inter, sans-serif",
    heading: {
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.02em"
    },
    body: {
      fontWeight: "400",
      lineHeight: "1.6",
      letterSpacing: "0"
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem"
    }
  },
  {
    id: "elegant-serif",
    name: "Elegant Serif",
    fontFamily: "Georgia, serif",
    heading: {
      fontWeight: "700",
      lineHeight: "1.3",
      letterSpacing: "-0.01em"
    },
    body: {
      fontWeight: "400",
      lineHeight: "1.7",
      letterSpacing: "0.01em"
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.375rem",
      "2xl": "1.75rem",
      "3xl": "2.25rem"
    }
  }
];

export const defaultSpacing: Spacing[] = [
  {
    id: "compact",
    name: "Compact",
    scale: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      "2xl": "2rem"
    },
    containerWidth: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    }
  },
  {
    id: "comfortable",
    name: "Comfortable",
    scale: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
      "2xl": "4rem"
    },
    containerWidth: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    }
  }
];
