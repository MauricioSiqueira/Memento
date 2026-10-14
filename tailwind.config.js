/** @type {import('tailwindcss').Config} */
module.exports = {
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
        },
      },
    },
  },
  plugins: [],
};
