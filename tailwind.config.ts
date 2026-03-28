import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ━━━ HEXIS WEB PALETTE — DARK THEME ━━━
      colors: {
        // Core dark palette
        'dark-bg': '#16181C',
        charcoal: '#1C1E23',
        'dark-type': '#E8E6E2',
        'dark-sub': '#8A8884',

        // Light theme (for specific components)
        paper: '#F8F7F5',
        ink: '#1C1E23',
        'ink-soft': '#444240',
        'ink-muted': '#686662',

        // Accent (use sparingly)
        brass: '#B2986C',
        stone: '#686662',

        // Governance maturity tones
        maturity: {
          absent: '#dedad4',
          adhoc: '#c4c2be',
          structured: '#8a8884',
          continuous: '#686662',
          embedded: '#1C1E23',
        },

        // Semantic colors (minimal, desaturated)
        status: {
          success: '#6B8F71',
          warning: '#B2986C',
          danger: '#8B5C5C',
          info: '#6B7F8F',
        },
      },

      // ━━━ BORDERS ━━━
      borderColor: {
        rule: 'rgba(28,30,35,0.14)',
        'rule-s': 'rgba(28,30,35,0.08)',
        border: 'rgba(232,230,226,0.10)',
        border2: 'rgba(232,230,226,0.18)',
      },

      // ━━━ BACKGROUNDS ━━━
      backgroundColor: {
        card: 'rgba(232,230,226,0.04)',
        'card-hover': 'rgba(232,230,226,0.07)',
      },

      // ━━━ TYPOGRAPHY ━━━
      fontFamily: {
        heading: ['Georgia', "'Times New Roman'", 'serif'],
        body: ['Arial', 'Helvetica', 'sans-serif'],
      },

      fontSize: {
        label: ['9px', { letterSpacing: '0.1em', lineHeight: '1.2' }],
      },

      // ━━━ HEXIS RULES ━━━
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px', // only for avatars/badges
      },

      boxShadow: {
        // No shadows in Hexis design
        DEFAULT: 'none',
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
      },
    },
  },
  plugins: [],
};

export default config;
