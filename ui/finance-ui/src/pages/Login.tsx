import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Paper, TextField, Button, Typography, IconButton,
    InputAdornment, Alert, CircularProgress, Container
} from '@mui/material';
import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, setLoading, setError } from '../features/auth/authSlice';
import { authApi } from '../api/authApi';
import { PATHS } from '../routes/paths';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useAppSelector((state) => state.auth);

    const from = location.state?.from?.pathname || PATHS.DASHBOARD;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await authApi.login({ username, password });
            dispatch(setCredentials(response));

            // Handle the 'from' path or default to DASHBOARD, replacing the :username param
            const redirectPath = from.includes(':username')
                ? from.replace(':username', response.user.username)
                : `/${response.user.username}${from === '/' ? '/dashboard' : from}`;

            navigate(redirectPath, { replace: true });
        } catch (err: any) {
            dispatch(setError(err.message || 'Login failed. Please check your credentials.'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0a1929 0%, #101f33 100%)'
                : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
                }}>
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Box sx={{
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: 3,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            opacity: 0.9,
                            mb: 2
                        }}>
                            <ShieldCheck size={40} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please enter your details to sign in
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                Username
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <User size={20} color="currentColor" style={{ opacity: 0.5 }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock size={20} color="currentColor" style={{ opacity: 0.5 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading || !username || !password}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: '1rem',
                                boxShadow: (theme) => `0 4px 6px -1px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 91, 171, 0.2)'}`,
                                '&:hover': {
                                    boxShadow: (theme) => `0 10px 15px -3px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 91, 171, 0.3)'}`,
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
