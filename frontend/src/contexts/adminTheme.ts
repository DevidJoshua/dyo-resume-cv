import { createTheme, type Theme } from '@mui/material/styles';

// Spoli color tokens (kept in sync with spoli/scss/_variables.scss)
export const spoliTokens = {
  // main palette
  m1: '#141414', // primary dark
  m2: '#8A8A8A', // secondary text
  m3: '#FFFFFF', // light surface
  // accents
  a1: '#FF8473', // coral primary accent
  a2: '#FFE588', // yellow highlight
  a3: '#7152E1', // purple secondary accent
  // admin sidebar background (existing)
  adminSidebar: '#1a1a2e',
  adminSidebarDeep: '#16213e',
};

/** Light MUI theme — admin surface */
export const lightAdminTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: spoliTokens.a1,
      contrastText: spoliTokens.m3,
    },
    secondary: {
      main: spoliTokens.a3,
      contrastText: spoliTokens.m3,
    },
    background: {
      default: '#f5f5f5',
      paper: spoliTokens.m3,
    },
    text: {
      primary: spoliTokens.m1,
      secondary: spoliTokens.m2,
    },
    divider: 'rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

/** Dark MUI theme — admin surface */
export const darkAdminTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: spoliTokens.a1,
      contrastText: spoliTokens.m1,
    },
    secondary: {
      main: spoliTokens.a3,
      contrastText: spoliTokens.m3,
    },
    background: {
      default: '#0f0f1a',
      paper: spoliTokens.adminSidebar,
    },
    text: {
      primary: spoliTokens.m3,
      secondary: 'rgba(255,255,255,0.7)',
    },
    divider: 'rgba(255,255,255,0.1)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Inter', sans-serif", fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});