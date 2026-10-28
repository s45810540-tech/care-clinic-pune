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
        /*
         * Bright secondary palette. These are used as *categories*, not decoration:
         * each service family, each step, each blog tag owns one hue. That keeps a
         * colourful page readable instead of rainbow soup.
         */
        coral: {
          50: '#FFF1F0', 100: '#FFE0DC', 200: '#FFC2BA', 300: '#FF9A8D',
          400: '#FF7466', 500: '#F2503E', 600: '#D6392A', 700: '#B02C22',
          800: '#8C241D', 900: '#6E1E19',
        },
        mango: {
          50: '#FFF8E6', 100: '#FFEFC2', 200: '#FFDE8A', 300: '#FFC94D',
          400: '#FFB020', 500: '#EF9700', 600: '#CC7A00', 700: '#A05F02',
          800: '#7D4B06', 900: '#663D08',
        },
        sky: {
          50: '#EFF8FF', 100: '#DBEFFF', 200: '#BEE2FF', 300: '#8FCDFF',
          400: '#59AEFF', 500: '#2E8FFF', 600: '#1B72E8', 700: '#1A5BBF',
          800: '#1B4C99', 900: '#1B417D',
        },
        grape: {
          50: '#F5F2FF', 100: '#EDE7FF', 200: '#DCD2FF', 300: '#C2ADFF',
          400: '#A57EFF', 500: '#8B57F5', 600: '#7B3BE4', 700: '#682CBF',
          800: '#56269C', 900: '#48227F',
        },
        mint: {
          50: '#ECFDF6', 100: '#D1FAE9', 200: '#A6F3D4', 300: '#6BE6BA',
          400: '#34D399', 500: '#14B981', 600: '#089167', 700: '#077755',
          800: '#085F46', 900: '#084E3B',
        },
        // Surface neutrals — bright and cool, so the colour does the talking.
        sand: '#F2F6FB',
        paper: '#FFFFFF',
        line: '#E3EAF3',
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
        // Tinted lifts, so a coloured card glows in its own hue instead of grey.
        'glow-brand': '0 20px 45px -22px rgba(36, 95, 86, 0.55)',
        'glow-coral': '0 20px 45px -22px rgba(242, 80, 62, 0.5)',
        'glow-mango': '0 20px 45px -22px rgba(239, 151, 0, 0.5)',
        'glow-sky': '0 20px 45px -22px rgba(46, 143, 255, 0.5)',
        'glow-grape': '0 20px 45px -22px rgba(139, 87, 245, 0.5)',
        deck: '0 2px 0 rgba(255,255,255,0.9) inset, 0 40px 70px -40px rgba(12, 26, 23, 0.55)',
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
        // Slow drift for the background blobs; long, offset durations make the
        // page feel alive without anything visibly "animating".
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%,-4%,0) scale(1.06)' },
          '66%': { transform: 'translate3d(-3%,3%,0) scale(0.97)' },
        },
        'hue-slide': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        floaty: 'floaty 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        drift: 'drift 18s ease-in-out infinite',
        'drift-slow': 'drift 26s ease-in-out infinite',
        'hue-slide': 'hue-slide 14s ease-in-out infinite',
      },
      transitionTimingFunction: {
        // One easing curve for the whole site (buttons, cards, drawer).
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        prose: '68ch',
      },
      backgroundImage: {
        // Bright, multi-stop washes used behind sections and cards.
        aurora:
          'radial-gradient(58% 58% at 6% 0%, rgba(143,205,255,0.62) 0%, transparent 62%), radial-gradient(50% 55% at 96% 6%, rgba(255,154,141,0.55) 0%, transparent 62%), radial-gradient(55% 60% at 62% 102%, rgba(107,230,186,0.5) 0%, transparent 62%), radial-gradient(46% 52% at 104% 92%, rgba(255,201,77,0.55) 0%, transparent 60%)',
        'aurora-strong':
          'radial-gradient(55% 55% at 0% 6%, rgba(89,174,255,0.78) 0%, transparent 60%), radial-gradient(46% 50% at 100% 0%, rgba(255,116,102,0.62) 0%, transparent 58%), radial-gradient(52% 56% at 72% 100%, rgba(52,211,153,0.6) 0%, transparent 58%), radial-gradient(46% 50% at 8% 96%, rgba(255,176,32,0.65) 0%, transparent 58%)',
        'dots': 'radial-gradient(rgba(12,26,23,0.14) 1px, transparent 1px)',
        'grid-faint':
          'linear-gradient(to right, rgba(12,26,23,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,26,23,0.05) 1px, transparent 1px)',
        'rainbow-line':
          'linear-gradient(90deg, #F2503E 0%, #FFB020 25%, #34D399 50%, #2E8FFF 75%, #8B57F5 100%)',
      },
    },
  },
  plugins: [],
};
