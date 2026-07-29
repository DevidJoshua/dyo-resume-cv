import { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useTheme } from './ThemeContext';
import { lightAdminTheme, darkAdminTheme } from './adminTheme';

/**
 * AdminMuiThemeProvider
 * ---------------------
 * Wraps MUI ThemeProvider + CssBaseline around children, picking the
 * light or dark MUI theme based on the existing ThemeContext toggle.
 *
 * Mount this ONLY under /admin routes so CssBaseline does NOT override
 * Spoli globals on the public portfolio pages.
 */
const AdminMuiThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { darkMode } = useTheme();
  const theme = darkMode ? darkAdminTheme : lightAdminTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};

export default AdminMuiThemeProvider;
