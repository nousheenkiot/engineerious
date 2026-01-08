import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#005bab', // Enterprise Blue
            light: '#358bcb',
            dark: '#003e7d',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#666666',
            light: '#999999',
            dark: '#333333',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#666666',
        },
        divider: '#e5e7eb',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 600, color: '#1a1a1a' },
        h2: { fontWeight: 600, color: '#1a1a1a' },
        h3: { fontWeight: 600, color: '#1a1a1a' },
        h4: { fontWeight: 600, color: '#1a1a1a' },
        h5: { fontWeight: 600, color: '#1a1a1a' },
        h6: { fontWeight: 600, color: '#1a1a1a' },
        body1: { fontSize: '0.875rem' },
        body2: { fontSize: '0.75rem' },
        button: { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' },
    },
    shape: {
        borderRadius: 4, // More crisp, professional feel
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    border: '1px solid #e5e7eb',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#f8f9fa',
                    fontWeight: 700,
                    color: '#4b5563',
                    borderBottom: '2px solid #e5e7eb',
                },
                root: {
                    padding: '12px 16px',
                },
            },
        },
    },
});

export default theme;
