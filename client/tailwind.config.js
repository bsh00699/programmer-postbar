module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        body: [
          'IBM Plex Sans'
        ]
      },
      spacing: {
        70: '22rem',
        160: '40rem'
      },
      container: false
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen sm': { maxWidth: '640px' },
          '@screen md': { maxWidth: '768px' },
          '@screen lg': { maxWidth: '975px' },
        }
      })
    }
  ],
}
