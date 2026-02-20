import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
    const isDark = mode === 'dark';

    return createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? '#4dabf5' : '#005bab', // Enterprise Blue
                light: isDark ? '#80d6ff' : '#358bcb',
                dark: isDark ? '#007ac1' : '#003e7d',
                contrastText: isDark ? '#000000' : '#ffffff',
            },
            secondary: {
                main: isDark ? '#b0bec5' : '#666666',
                light: isDark ? '#e2f1f8' : '#999999',
                dark: isDark ? '#808e95' : '#333333',
            },
            background: {
                default: isDark ? '#0a1929' : '#f8f9fa',
                paper: isDark ? '#101f33' : '#ffffff',
            },
            text: {
                primary: isDark ? '#ffffff' : '#1a1a1a',
                secondary: isDark ? '#b2bac2' : '#666666',
            },
            divider: isDark ? 'rgba(255, 255, 255, 0.12)' : '#e5e7eb',
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontWeight: 600, color: isDark ? '#ffffff' : '#1a1a1a' },
            h2: { fontWeight: 600, color: isDark ? '#ffffff' : '#1a1a1a' },
            h3: { fontWeight: 600, color: isDark ? '#ffffff' : '#1a1a1a' },
            h4: { fontWeight: 600, color: isDark ? '#ffffff' : '#1a1a1a' },
            h5: { fontWeight: 600, color: isDark ? '#ffffff' : '#1a1a1a' },
            h6: { fontWeight: 600, color: isDark ? '#ffffff' : '#1a1a1a' },
            body1: { fontSize: '0.875rem' },
            body2: { fontSize: '0.75rem' },
            button: { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' },
        },
        shape: {
            borderRadius: 4,
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
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#e5e7eb'}`,
                        backgroundImage: 'none', // Remove MUI default dark overlay
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        backgroundColor: isDark ? '#1a2027' : '#f8f9fa',
                        fontWeight: 700,
                        color: isDark ? '#b2bac2' : '#4b5563',
                        borderBottom: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#e5e7eb'}`,
                    },
                    root: {
                        padding: '12px 16px',
                        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#e5e7eb'}`,
                    },
                },
            },
        },
    });
};

export default getTheme('light');

