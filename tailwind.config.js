module.exports = {
  purge: {
    content: ['content/**/*.md'],
  },
  darkMode: 'media',
  theme: {
    screens: {
      sm: { min: '640px', max: '767px' },
      md: { min: '768px', max: '1023px' },
      lg: { min: '1024px', max: '1279px' },
      xl: { min: '1280px', max: '1535px' },
      '2xl': { min: '1536px' },
      mobile: { max: '639px' },
    },
  },
}
