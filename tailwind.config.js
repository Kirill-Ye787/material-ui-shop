export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  // MUI CssBaseline owns the reset; Tailwind owns utility styling.
  corePlugins: { preflight: false },
  theme: {
    screens: { sm: '768px', md: '1024px', lg: '1280px', xl: '1440px' },
    extend: {
      colors: {
        primary: { 50: '#eef6f1', 100: '#dcebe2', 500: '#287357', 700: '#174c3c', 900: '#11372c' },
        ink: '#20352c',
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        copy: 'var(--text)',
        muted: 'var(--muted)',
        line: 'var(--border)',
      },
      fontFamily: { sans: ['Segoe UI', 'Arial', 'sans-serif'] },
    },
  },
  plugins: [],
};
