import { createTheme } from '@mui/material/styles';

// Garage-dashboard palette: dark charcoal base with amber "warning light" accent,
// teal for healthy status, rust-red for overdue/alert states.
const palette = {
  charcoal: '#1C2128',
  graphite: '#2D333B',
  graphiteLight: '#373E47',
  amber: '#F2A03D',
  teal: '#3DDC97',
  rust: '#E5484D',
  offWhite: '#EDEDEF',
  muted: '#8B949E',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: palette.charcoal,
      paper: palette.graphite,
    },
    primary: {
      main: palette.amber,
      contrastText: palette.charcoal,
    },
    secondary: {
      main: palette.teal,
      contrastText: palette.charcoal,
    },
    error: {
      main: palette.rust,
    },
    success: {
      main: palette.teal,
    },
    warning: {
      main: palette.amber,
    },
    text: {
      primary: palette.offWhite,
      secondary: palette.muted,
    },
    divider: 'rgba(237, 237, 239, 0.08)',
  },
  custom: palette,
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    button: { fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none' },
    overline: { fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.08em' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 18,
          paddingRight: 18,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: palette.graphite,
          border: '1px solid rgba(237, 237, 239, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.charcoal,
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(237, 237, 239, 0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
