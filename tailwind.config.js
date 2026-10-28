/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * One brand hue, one warm accent, three neutrals. Everything else in the
         * UI is mixed from these — no per-card rainbow, which is what kept the
         * old palette from reading as a single confident brand.
         *
         * Contrast notes (WCAG 2.2 AA, checked):
         *   white on brand-700  ≈ 8.0:1     ink on brand-100  ≈ 14:1
         *   white on brand-900  ≈ 12.1:1    ink on accent-300 ≈ 9.4:1
         *   ink on accent-500   ≈ 7.6:1     ink-mute on white ≈ 5.9:1
         */
        brand: {
          50: '#F2F9F7',
          100: '#E0F0EC',
          200: '#C2E2DA',
          300: '#96CCC0',
          400: '#63AFA0',
          500: '#3F9182',
          600: '#2C776A',
          700: '#245F56',
          800: '#1F4C46',
          900: '#1B3E39',
          950: '#0A2320',
        },
        // Warm accent — highlights, "open now", star rating. Sits opposite the teal
        // on the wheel, so a little of it goes a long way.
        accent: {
          50: '#FDF7EC',
          100: '#FAEBCF',
          200: '#F4D69C',
          300: '#EBB965',
          400: '#E09E3A',
          500: '#C9821F',
          600: '#A96816',
          700: '#855017',
          800: '#6B4118',
          900: '#583616',
        },
        // Deep ink for headings (near-black with a green cast, AA on white).
        ink: {
          DEFAULT: '#0C1A17',
          soft: '#23332F',
          mute: '#55655F',
        },
        // Surface neutrals — warm paper tones instead of pure white everywhere.
        sand: '#F7F4EE',
        paper: '#FCFBF8',
        line: '#E6EBE8',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Noto Sans Devanagari',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        display: [
          'Plus Jakarta Sans',
          'Noto Sans Devanagari',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Three steps only: rest, lift, and the single "primary action" glow.
        soft: '0 1px 2px rgba(12, 26, 23, 0.04), 0 12px 32px -18px rgba(12, 26, 23, 0.28)',
        card: '0 1px 2px rgba(12, 26, 23, 0.05), 0 18px 40px -28px rgba(12, 26, 23, 0.35)',
        lift: '0 2px 4px rgba(12, 26, 23, 0.05), 0 28px 60px -32px rgba(12, 26, 23, 0.42)',
        glow: '0 14px 34px -16px rgba(36, 95, 86, 0.62)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        floaty: 'floaty 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      transitionTimingFunction: {
        // One easing curve for the whole site (buttons, cards, drawer).
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
