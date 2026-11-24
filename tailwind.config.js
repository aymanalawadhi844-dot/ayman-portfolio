/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', 'src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        ink: {
          950: '#09090B',
          900: '#0C0C0F',
          850: '#131316',
          800: '#1A1A1F',
          700: '#27272F',
          600: '#3F3F46',
          500: '#52525B',
          400: '#A1A1AA',
          300: '#D4D4D8',
          200: '#E4E4E7',
          100: '#F4F4F5',
        },
        gold: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        sky: {
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
      },
      backgroundImage: {
        'grid-lux': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'hero-radial': 'radial-gradient(ellipse 60% 50% at 70% 20%, rgba(14,165,233,0.08), transparent), radial-gradient(ellipse 50% 40% at 30% 80%, rgba(245,158,11,0.06), transparent)',
      },
      backgroundSize: {
        'grid-lux': '48px 48px',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'ring-rotate': 'ringRotate 10s linear infinite',
        'frame-glow': 'frameGlow 4.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.3' },
          '50%': { opacity: '0.7' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        ringRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        frameGlow: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(56, 189, 248, 0.14), 0 0 0 1px rgba(255, 255, 255, 0.10)' },
          '50%': { boxShadow: '0 0 38px rgba(56, 189, 248, 0.24), 0 0 0 1px rgba(251, 191, 36, 0.22)' },
        },
      },
    },
  },
  plugins: [],
};
