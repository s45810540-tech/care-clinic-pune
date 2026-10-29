/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * ELECTRIC INDIGO primary. Deep enough to carry white text, saturated
         * enough to feel contemporary on a medical site, and nowhere near the
         * teal-everywhere default that made the old build look dated.
         *
         * Contrast notes (WCAG 2.2 AA, checked):
         *   white on brand-600 ≈ 6.2:1      white on brand-700 ≈ 8.4:1
         *   white on brand-900 ≈ 12.6:1     ink on brand-100   ≈ 15.4:1
         *   ink on accent-400  ≈ 7.2:1      ink-mute on white  ≈ 5.4:1
         */
        brand: {
          50: '#F2F0FF',
          100: '#E5E0FF',
          200: '#CCC3FF',
          300: '#AC9BFF',
          400: '#8A72FB',
          500: '#6E4BF3',
          600: '#5A32DC',
          700: '#4A22B8',
          800: '#3C1D94',
          900: '#311A76',
          950: '#1B0E45',
        },
        // Coral accent — actions, stars, "open now" warmth against the indigo.
        accent: {
          50: '#FFF3EF',
          100: '#FFE2D9',
          200: '#FFC2B0',
          300: '#FF9C82',
          400: '#FF7A57',
          500: '#F2572F',
          600: '#D33E1C',
          700: '#AB3016',
          800: '#872815',
          900: '#6D2314',
        },
        // Navy ink instead of green-black: crisper on cool surfaces.
        ink: {
          DEFAULT: '#0A1224',
          soft: '#1E2A44',
          mute: '#57647F',
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
        sand: '#F5F6FC',
        paper: '#FFFFFF',
        line: '#E4E6F1',
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
          // Bricolage has no Devanagari, so Marathi headlines fall through to
          // Noto — the metric-compatible pair keeps the two scripts in tune.
          'Bricolage Grotesque',
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
        // Playful accents, deliberately small: a sticker wiggle, a soft bob for
        // doodles, and an endless ribbon.
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--bob-rot, 0deg))' },
          '50%': { transform: 'translateY(-8px) rotate(var(--bob-rot, 0deg))' },
        },
        ribbon: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.86)' },
          '60%': { opacity: '1', transform: 'scale(1.03)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
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
        wiggle: 'wiggle 3.6s ease-in-out infinite',
        bob: 'bob 5s ease-in-out infinite',
        ribbon: 'ribbon 34s linear infinite',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      transitionTimingFunction: {
        // One easing curve for the whole site (buttons, cards, drawer), plus a
        // spring used only where a little bounce reads as friendly, not sloppy.
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      maxWidth: {
        prose: '68ch',
      },
      backgroundImage: {
        // Bright, multi-stop washes used behind sections and cards.
        aurora:
          'radial-gradient(75% 42% at 50% 48%, rgba(219,239,255,0.85) 0%, transparent 72%), radial-gradient(58% 58% at 6% 0%, rgba(143,205,255,0.62) 0%, transparent 62%), radial-gradient(50% 55% at 96% 6%, rgba(255,154,141,0.55) 0%, transparent 62%), radial-gradient(55% 60% at 62% 102%, rgba(107,230,186,0.5) 0%, transparent 62%), radial-gradient(46% 52% at 104% 92%, rgba(255,201,77,0.55) 0%, transparent 60%)',
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
