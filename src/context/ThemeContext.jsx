import { createContext, useContext, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { usePersistentState } from '../hooks/usePersistentState.js';

const ThemeContext = createContext(null);
export function AppThemeProvider({ children }) {
  const [mode, setMode] = usePersistentState('theme', 'light', value => value === 'dark' ? 'dark' : 'light');
  useEffect(() => { document.documentElement.classList.toggle('dark', mode === 'dark'); }, [mode]);
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#a4d8b8' : '#174c3c' },
      secondary: { main: '#d69248' },
      background: { default: mode === 'dark' ? '#121b17' : '#f7f8f4', paper: mode === 'dark' ? '#1c2821' : '#ffffff' },
      text: { primary: mode === 'dark' ? '#edf3ed' : '#20352c', secondary: mode === 'dark' ? '#a8b8ad' : '#69786f' },
    },
    typography: { fontFamily: '"Segoe UI", Arial, sans-serif', button: { textTransform: 'none', fontWeight: 650 } },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 42 } } },
      MuiIconButton: { styleOverrides: { root: { minWidth: 42, minHeight: 42 } } },
      MuiAccordion: { defaultProps: { disableGutters: true, elevation: 0 }, styleOverrides: { root: { background: 'transparent', '&:before': { display: 'none' } } } },
      MuiCheckbox: { defaultProps: { size: 'small' } },
    },
  }), [mode]);
  return <ThemeContext.Provider value={{ mode, toggleTheme: () => setMode(value => value === 'light' ? 'dark' : 'light') }}>
    <StyledEngineProvider injectFirst><ThemeProvider theme={theme}><CssBaseline enableColorScheme />{children}</ThemeProvider></StyledEngineProvider>
  </ThemeContext.Provider>;
}
export const useAppTheme = () => useContext(ThemeContext);
