/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: "#c15f3c",
          hover: "#a94f30",
          light: "rgba(193, 95, 60, 0.12)",
          border: "rgba(193, 95, 60, 0.35)",
        },
        parchment: {
          DEFAULT: "#f4f3ee",
          subtle: "#ebeae3",
          surface: "#ffffff",
        },
        stone: {
          DEFAULT: "#b1ada1",
          light: "rgba(177, 173, 161, 0.2)",
          border: "rgba(177, 173, 161, 0.4)",
          dark: "#2b2723",
          muted: "#767167",
        },
        brand: {
          orange: "#c15f3c",
          orangeHover: "#a94f30",
          orangeActive: "#8f3f22",
          orangeMuted: "rgba(193, 95, 60, 0.12)",
          orangeGlow: "rgba(193, 95, 60, 0.3)",
        },
        bg: {
          dark: "#f4f3ee",
          surface: "#ffffff",
          elevated: "#ffffff",
          subtle: "#ebeae3",
        },
        fg: {
          primary: "#2b2723",
          secondary: "#767167",
          muted: "#b1ada1",
        },
        glass: {
          border: "rgba(177, 173, 161, 0.35)",
          borderHover: "rgba(193, 95, 60, 0.5)",
          borderOrange: "rgba(193, 95, 60, 0.4)",
          bg: "#ffffff",
          bgElevated: "#ffffff",
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(193, 95, 60, 0.35)',
        'glow-orange-lg': '0 0 45px -8px rgba(193, 95, 60, 0.4)',
        'glow-orange-sm': '0 0 12px -2px rgba(193, 95, 60, 0.35)',
        'glass': '0 8px 30px 0 rgba(177, 173, 161, 0.15)',
        'card-soft': '0 2px 12px -2px rgba(177, 173, 161, 0.2), 0 1px 3px 0 rgba(177, 173, 161, 0.1)',
        'card-hover': '0 12px 28px -6px rgba(193, 95, 60, 0.18), 0 4px 10px -2px rgba(177, 173, 161, 0.12)',
      },
      animation: {
        'scan-vertical': 'scan 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
