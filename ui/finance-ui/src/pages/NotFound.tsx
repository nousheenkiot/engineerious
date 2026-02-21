import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';
import { PATHS } from '../routes/paths';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h1" sx={{ fontSize: '10rem', fontWeight: 800, opacity: (theme) => theme.palette.mode === 'dark' ? 0.05 : 0.1, color: 'text.primary' }}>
                    404
                </Typography>
                <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
                    Oops! Page not found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(PATHS.DASHBOARD.replace(':username', username || ''))}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradient(45deg, #4dabf5 30%, #2196f3 90%)'
                            : 'linear-gradient(45deg, #3b82f6 30%, #2563eb 90%)',
                        boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(37, 99, 235, 0.3)',
                    }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
