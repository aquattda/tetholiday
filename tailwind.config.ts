import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tet: {
          red: '#DC2626',
          'red-dark': '#991B1B',
          'red-deeper': '#7F1D1D',
          gold: '#F59E0B',
          'gold-dark': '#D97706',
          'gold-light': '#FDE68A',
          cream: '#FEF3C7',
          dark: '#1A0505',
          'dark-light': '#2D0A0A',
        },
      },
      fontFamily: {
        vietnamese: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      animation: {
        'fall': 'fall linear infinite',
        'sway': 'sway ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-red': 'pulseRed 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'confetti': 'confetti 3s ease-out forwards',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh) translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) translateX(80px) rotate(720deg)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(245, 158, 11, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(245, 158, 11, 0.6), 0 0 50px rgba(245, 158, 11, 0.3)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
