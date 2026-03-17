/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#0A66C2',
        'primary-dark': '#0050A0',
        'primary-light': '#E8F0FE',
        deep:      '#0A2540',
        'deep-mid':'#0D2F50',
        neutral:   '#64748B',
        surface:   '#F8FAFC',
        platinum:  '#D97706',
        gold:      '#059669',
        silver:    '#2563EB',
        bronze:    '#6B7280',
      },
      fontFamily: {
        sans:  ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0A2540 0%, #0A66C2 100%)',
        'gradient-hero':    'linear-gradient(160deg, #030D1A 0%, #0A2540 40%, #0A66C2 100%)',
      },
      animation: {
        'ticker':     'ticker 60s linear infinite',
        'live-pulse': 'live-pulse 2s ease-in-out infinite',
        'fade-in':    'fadeIn .4s ease-out',
        'slide-up':   'slideUp .5s ease-out',
      },
      keyframes: {
        ticker:       { '100%': { transform: 'translateX(-50%)' } },
        'live-pulse': { '0%,100%': { opacity:'1', transform:'scale(1)' }, '50%': { opacity:'.6', transform:'scale(1.3)' } },
        fadeIn:       { from: { opacity:'0' }, to: { opacity:'1' } },
        slideUp:      { from: { opacity:'0', transform:'translateY(16px)' }, to: { opacity:'1', transform:'translateY(0)' } },
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,.1)',
        'blue':   '0 4px 16px rgba(10,102,194,.2)',
      },
    },
  },
  plugins: [],
};
