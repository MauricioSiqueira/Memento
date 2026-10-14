/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  safelist: [
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-[16px]',
    'text-[18px]',
    'text-[20px]',
    'text-[26px]',
    'text-[34px]',
  ],
  theme: {
    extend: {
      colors: {
        memento: {
          canvas: '#FAF5F2',
          ink: '#4A3A35',
          muted: '#6A5A55',
          accent: '#F29CBA',
          line: '#EFEAE7',
          placeholder: '#B0A6A4',
          danger: '#E0637A',
          'canvas-dark': '#181517',
          'surface-dark': '#252124',
          'ink-dark': '#FFF8F6',
          'muted-dark': '#C9BCB8',
          'line-dark': '#40383C',
          'placeholder-dark': '#A99DA2',
        },
      },
    },
  },
  plugins: [],
};
