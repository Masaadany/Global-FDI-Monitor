import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { dark:'#1A2C3E', teal:'#2ECC71', gold:'#F1C40F', blue:'#3498DB', purple:'#9B59B6', red:'#E74C3C' },
        text: { primary:'#1A2C3E', secondary:'#5A6874', light:'#7F8C8D' },
        background: { white:'#FFFFFF', offwhite:'#F8F9FA', gray:'#ECF0F1' },
        border: { light:'#ECF0F1' },
      },
      fontFamily: {
        sans: ['Inter','Helvetica Neue','system-ui','sans-serif'],
        mono: ['JetBrains Mono','monospace'],
      },
      animation: {
        'slide-up':'slideUpFade 0.4s cubic-bezier(0.2,0.9,0.4,1.1) forwards',
        'slide-in-right':'slideInRight 0.3s ease-out forwards',
        'pulse-green':'pulseGreen 0.6s ease-out',
        'float':'float 6s ease-in-out infinite',
      },
      keyframes: {
        slideUpFade: { from:{opacity:'0',transform:'translateY(20px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        slideInRight: { from:{opacity:'0',transform:'translateX(30px)'}, to:{opacity:'1',transform:'translateX(0)'} },
        pulseGreen: { '0%':{boxShadow:'0 0 0 0 rgba(46,204,113,0.4)'}, '70%':{boxShadow:'0 0 0 10px rgba(46,204,113,0)'}, '100%':{boxShadow:'0 0 0 0 rgba(46,204,113,0)'} },
        float: { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-10px)'} },
      },
    },
  },
  plugins: [],
}
export default config
