/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // FDI Monitor Brand Palette
        midnight: '#0F0A0A',
        twilight: '#0F2021',
        dusk:     '#0F3538',
        cloud:    '#496767',
        fog:      '#87A19E',
        radiance: '#FF6600',
        warmth:   '#FF9200',
        shine:    '#FFBE00',
        gleam:    '#F8E08E',
        bright:   '#FAFAF0',
        // Semantic
        primary: {
          DEFAULT: '#FF6600',
          hover:   '#FF9200',
          light:   'rgba(255,102,0,0.12)',
        },
        deep:    '#0F3538',
        surface: '#0F1A1C',
        neutral: '#496767',
        // Grade colors
        platinum: '#FFBE00',
        gold:     '#FF9200',
        silver:   '#87A19E',
        bronze:   '#496767',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
        arabic:['Cairo', 'Noto Naskh Arabic', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '16px', '3xl': '20px' },
      boxShadow: {
        'glow-orange': '0 4px 24px rgba(255,102,0,0.3)',
        'glow-sm':     '0 2px 12px rgba(255,102,0,0.15)',
        'card':        '0 2px 16px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'brand-gradient':  'linear-gradient(135deg, #0F0A0A 0%, #0F2021 50%, #0F3538 100%)',
        'accent-gradient': 'linear-gradient(90deg, #FF6600, #FFBE00)',
        'card-gradient':   'linear-gradient(135deg, rgba(15,37,38,0.9), rgba(15,32,33,0.7))',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow':        'glowPulse 3s ease-in-out infinite',
        'slide-up':    'fadeIn 0.4s ease forwards',
        'ticker':      'ticker 30s linear infinite',
      },
    },
  },
  plugins: [],
};
