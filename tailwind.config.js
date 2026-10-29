/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * FOREST + LIME. Deep forest green carries the trust a clinic needs;
         * chartreuse lime is the jolt of personality on top. Warm paper
         * surfaces keep it editorial rather than clinical.
         *
         * Contrast notes (WCAG 2.2 AA, checked):
         *   white on brand-600 ≈ 5.9:1      white on brand-700 ≈ 8.1:1
         *   white on brand-900 ≈ 12.8:1     ink on brand-100   ≈ 15.1:1
         *   ink on accent-400  ≈ 12.6:1     ink-mute on white  ≈ 6.1:1
         */
        brand: {
          50: '#F0F7F2',
          100: '#DBEDE1',
          200: '#B7DAC5',
          300: '#88C0A0',
          400: '#55A077',
          500: '#2F835B',
          600: '#1F6A49',
          700: '#18553B',
          800: '#144430',
          900: '#103627',
          950: '#061F17',
        },
        // Chartreuse accent. Always paired with ink, never white text.
        accent: {
          50: '#F7FFE8',
          100: '#ECFFC4',
          200: '#DCFF8A',
          300: '#CAF94F',
          400: '#B4EE1F',
          500: '#9AD400',
          600: '#7BAF00',
          700: '#5E8700',
          800: '#4A6B00',
          900: '#3C5700',
        },
        // Charcoal ink, warm-neutral rather than blue-black.
        ink: {
          DEFAULT: '#0D1512',
          soft: '#1D2A24',
          mute: '#56645C',
        },
        /*
         * Bright secondary palette. These are used as *categories*, not decoration:
         * each service family, each step, each blog tag owns one hue. That keeps a
         * colourful page readable instead of rainbow soup.
         */
        coral: {
          50: '#FFF4EC', 100: '#FFE6D5', 200: '#FFCBAE', 300: '#FFAC85',
          400: '#FF8E5A', 500: '#F9703A', 600: '#DB5726', 700: '#B4451E',
          800: '#8F3819', 900: '#743016',
        },
        mango: {
          50: '#FFF9E8', 100: '#FFF0C2', 200: '#FFE08A', 300: '#FFCE4F',
          400: '#F7B81F', 500: '#DF9E0A', 600: '#BA8006', 700: '#936306',
          800: '#744E08', 900: '#5E4008',
        },
        sky: {
          50: '#EFF7FF', 100: '#DCEEFF', 200: '#B9DCFF', 300: '#8AC4FF',
          400: '#55A6F7', 500: '#2E88E4', 600: '#1B6CBF', 700: '#175699',
          800: '#15477D', 900: '#143C69',
        },
        grape: {
          50: '#F8F2FB', 100: '#EFE2F6', 200: '#DEC4EC', 300: '#C79BDD',
          400: '#AE70C9', 500: '#954FB2', 600: '#7C3D97', 700: '#65327B',
          800: '#532B65', 900: '#462657',
        },
        mint: {
          50: '#EDFBF5', 100: '#D3F6E8', 200: '#A8ECD2', 300: '#6FD9B4',
          400: '#3BBE93', 500: '#1FA17A', 600: '#158066', 700: '#146754',
          800: '#145446', 900: '#12463B',
        },
        // Surface neutrals — bright and cool, so the colour does the talking.
        sand: '#FAF7F0',
        paper: '#FFFFFF',
        line: '#E8E3D6',
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
