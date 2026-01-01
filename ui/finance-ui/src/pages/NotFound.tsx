import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';
import { PATHS } from '../routes/paths';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

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
                <Typography variant="h1" sx={{ fontSize: '10rem', fontWeight: 800, opacity: 0.1 }}>
                    404
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Oops! Page not found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(PATHS.DASHBOARD)}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #3b82f6 30%, #2563eb 90%)',
                        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)',
                    }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
