/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          active: '#166534',
          soft: '#DCFCE7',
          muted: '#22C55E',
          foreground: '#FFFFFF',
        },
        background: '#F7F8FA',
        card: '#FFFFFF',
        foreground: '#0F172A',
        body: '#1F2937',
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#6B7280',
        },
        border: '#E5E7EB',
        divider: '#F1F5F9',
        input: '#F5F6F8',
        placeholder: '#9CA3AF',   // <-- added this line
        success: '#16A34A',
        warning: '#F59E0B',
        destructive: '#EF4444',
        info: '#2AA3E0',
        whatsapp: '#22C55E',
        bitcoin: '#F7931A',
        bank: {
          nubank: '#8A05BE',
          bb: '#F9D016',
          bradesco: '#CC092F',
          itau: '#EC7000',
          caixa: '#1A6DD3',
          santander: '#EC0000',
          inter: '#FF7A00',
          c6: '#111111',
          pan: '#0B4C6B',
          btg: '#0A1A3C',
          mp: '#33B5E5',
          picpay: '#21C25E',
          neon: '#2E6BFF',
          pagbank: '#F5A623',
          sicoob: '#003D2B',
          sicredi: '#00995D',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        display: ['34px', { lineHeight: '40px', fontWeight: '800', letterSpacing: '-0.01em' }],
        h1: ['28px', { lineHeight: '34px', fontWeight: '700', letterSpacing: '-0.01em' }],
        h2: ['22px', { lineHeight: '28px', fontWeight: '700' }],
        h3: ['18px', { lineHeight: '24px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        caption: ['13px', { lineHeight: '18px', fontWeight: '500' }],
        small: ['12px', { lineHeight: '16px' }],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(15,23,42,0.04)',
        sm: '0 2px 6px rgba(15,23,42,0.05)',
        md: '0 4px 12px rgba(15,23,42,0.06)',
        lg: '0 8px 24px rgba(15,23,42,0.08)',
        fab: '0 6px 20px rgba(22,163,74,0.35)',
        modal: '0 20px 60px rgba(15,23,42,0.25)',
        focus: '0 0 0 3px rgba(22,163,74,0.25)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-up': 'slide-up 250ms cubic-bezier(0.16,1,0.3,1)',
        'fade-in': 'fade-in 220ms ease-out',
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};