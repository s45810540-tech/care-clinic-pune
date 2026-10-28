/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Calm medical teal — primary actions / brand.
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Warm accent — highlights, "open now", star rating.
        accent: {
          50: '#FFF8EB',
          100: '#FEECC7',
          200: '#FDD68A',
          300: '#FBBC4B',
          400: '#F99B20',
          500: '#F27A0A',
          600: '#D65B06',
          700: '#B13F09',
          800: '#8E320F',
          900: '#762B10',
        },
        // Deep ink for headings (near-black with a green cast, AA on white).
        ink: {
          DEFAULT: '#0A1F1D',
          soft: '#1F3B37',
          mute: '#4A5F5B',
        },
        sand: '#FBF9F5',
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
      boxShadow: {
        soft: '0 10px 40px -12px rgba(10, 31, 29, 0.18)',
        card: '0 2px 10px -2px rgba(10, 31, 29, 0.08), 0 12px 32px -18px rgba(10, 31, 29, 0.35)',
        glow: '0 20px 60px -20px rgba(13, 148, 136, 0.55)',
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
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
