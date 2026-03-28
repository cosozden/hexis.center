import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ━━━ HEXIS WEB PALETTE — CSS VARIABLE DRIVEN ━━━
      // Uses CSS custom properties so .theme-light can override
      colors: {
        // Core theme-aware colors (resolve via CSS variables)
        'dark-bg': 'var(--dark-bg)',
        charcoal: 'var(--charcoal)',
        'dark-type': 'var(--dark-type)',
        'dark-sub': 'var(--dark-sub)',

        // Light theme tokens
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-muted': 'var(--ink-muted)',

        // Accent (use sparingly)
        brass: 'var(--brass)',
        stone: 'var(--stone)',

        // Governance maturity tones
        maturity: {
          absent: 'var(--absent)',
          adhoc: 'var(--adhoc)',
          structured: 'var(--structured)',
          continuous: 'var(--continuous)',
          embedded: 'var(--embedded)',
        },

        // Semantic colors (minimal, desaturated)
        status: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--danger)',
          info: 'var(--info)',
        },
      },

      // ━━━ BORDERS ━━━
      borderColor: {
        rule: 'var(--rule)',
        'rule-s': 'var(--rule-s)',
        border: 'var(--border)',
        border2: 'var(--border2)',
      },

      // ━━━ BACKGROUNDS ━━━
      backgroundColor: {
        card: 'var(--card)',
        'card-hover': 'var(--card-hover)',
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
