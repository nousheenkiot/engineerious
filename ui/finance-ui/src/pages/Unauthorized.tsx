import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Paper } from '@mui/material';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { PATHS } from '../routes/paths';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
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
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        border: '1px solid #fee2e2',
                        bgcolor: '#fffafb',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3
                    }}
                >
                    <Box sx={{ bgcolor: '#fee2e2', p: 2, borderRadius: '50%', color: '#dc2626' }}>
                        <ShieldAlert size={48} />
                    </Box>

                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Access Denied
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            You do not have the required permissions to access this page.
                            Please contact your administrator if you believe this is an error.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowLeft size={18} />}
                            onClick={() => navigate(-1)}
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Go Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate(PATHS.DASHBOARD)}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                bgcolor: '#dc2626',
                                '&:hover': { bgcolor: '#b91c1c' }
                            }}
                        >
                            Dashboard
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Unauthorized;
