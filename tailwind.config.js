/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lighterPurple' :' #7e22ce',
        'mainPurple': '#581C87',
        'mainGreen' : '#4B871C'
      },
      fontFamily: {
        'navLogo': ['ADLaM Display', 'sans-serif'],
        'navLinks' : ['Lato', 'sans-serif'],
        'homeTitle' : ['Archivo Black', 'sans-serif'],
        'homeButtons' : ['Audiowide', 'cursive']
      },
      screens: {
        'xs': '500px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
