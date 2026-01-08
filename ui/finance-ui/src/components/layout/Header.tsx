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
import { Menu, Bell, Search, Monitor } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
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
                        sx={{ mr: 2, border: '1px solid #e5e7eb', borderRadius: 1 }}
                    >
                        <Menu size={18} />
                    </IconButton>

                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            bgcolor: '#f9fafb',
                            px: 1.5,
                            py: 0.75,
                            borderRadius: '4px',
                            border: '1px solid #e5e7eb',
                            width: 300
                        }}
                    >
                        <Search size={14} style={{ color: '#666666', marginRight: 8 }} />
                        <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>Global search...</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="View System Status">
                        <IconButton size="small" sx={{ color: '#666666' }}>
                            <Monitor size={18} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications">
                        <IconButton size="small" sx={{ color: '#666666' }}>
                            <Badge badgeContent={3} color="primary">
                                <Bell size={18} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', lineHeight: 1.2 }}>Nousheen Kiot</Typography>
                            <Typography variant="caption" sx={{ color: '#666666' }}>System Administrator</Typography>
                        </Box>
                        <Avatar
                            alt="User Profile"
                            sx={{
                                width: 34,
                                height: 34,
                                border: '1px solid #e5e7eb',
                                bgcolor: 'primary.main',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}
                        >
                            NK
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
