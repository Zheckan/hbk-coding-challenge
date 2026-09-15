import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    background: {
      default: '#f4f7fa',
      paper: '#ffffff',
    },
    divider: '#d5dee7',
    error: {
      main: '#b42318',
    },
    info: {
      main: '#006b87',
    },
    primary: {
      main: '#005a8b',
      dark: '#003f63',
      light: '#d8edf8',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e6b46',
    },
    text: {
      primary: '#172331',
      secondary: '#526171',
    },
    warning: {
      main: '#955300',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: {
      fontSize: 'clamp(2rem, 6vw, 3rem)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.08,
    },
    h5: {
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h6: {
      fontWeight: 700,
      lineHeight: 1.35,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*:focus-visible': {
          outline: '3px solid #005a8b',
          outlineOffset: 3,
        },
        html: {
          scrollbarGutter: 'stable',
        },
        body: {
          minWidth: 320,
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            scrollBehavior: 'auto !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'always',
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
        },
      },
    },
  },
})
