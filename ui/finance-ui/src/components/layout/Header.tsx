import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Avatar,
    Badge,
    Tooltip
} from '@mui/material';
import { Menu, Bell, Search, Monitor, Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleTheme } from '../../features/theme/themeSlice';

import { useParams } from 'react-router-dom';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { username } = useParams<{ username: string }>();
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.theme.mode);

    const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1) : 'User';
    const initals = username ? username.slice(0, 2).toUpperCase() : 'U';

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="default"
                        size="small"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ mr: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                    >
                        <Menu size={18} />
                    </IconButton>

                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            bgcolor: 'background.default',
                            px: 1.5,
                            py: 0.75,
                            borderRadius: '4px',
                            border: '1px solid',
                            borderColor: 'divider',
                            width: 300
                        }}
                    >
                        <Search size={14} style={{ opacity: 0.6, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.6, fontSize: '0.8rem' }}>Global search...</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                        <IconButton size="small" onClick={() => dispatch(toggleTheme())} sx={{ color: 'text.secondary' }}>
                            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="View System Status">
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <Monitor size={18} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications">
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <Badge badgeContent={3} color="primary">
                                <Bell size={18} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>{displayName}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>System User</Typography>
                        </Box>
                        <Avatar
                            alt={displayName}
                            sx={{
                                width: 34,
                                height: 34,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'primary.main',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}
                        >
                            {initals}
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
