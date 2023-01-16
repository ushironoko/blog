/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,vue}', './nuxt.config.{js,ts}'],
  theme: {
    screens: {
      tablet: { min: '720px' },
      pc: { min: '960px' },
    },
    width: {
      auto: 'auto',
      full: '100%',
      screen: '100vw',
    },
    fontSize: {
      0: ['0px', { lineHeight: '0px', letterSpacing: '0' }],
      12: ['12px', { lineHeight: '20px', letterSpacing: '0.02em' }],
      16: ['16px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      20: ['20px', { lineHeight: '32px', letterSpacing: '0.01em' }],
      28: ['28px', { lineHeight: '44px', letterSpacing: '0.01em' }],
      32: ['32px', { lineHeight: '52px', letterSpacing: '0.01em' }],
    },
    fontWeight: {
      normal: 400,
      bold: 700,
    },
    spacing: {
      0: '0px',
      0.5: '4px',
      1: '8px',
      1.5: '12px',
      2: '16px',
      2.5: '20px',
      3: '24px',
      4: '32px',
      5: '40px',
      6: '48px',
      7: '56px',
      8: '64px',
    },
    extend: {
      fontFamily: { abel: 'Abel', noto: 'Noto+Sans+JP' },
    },
  },
  plugins: [],
};
