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
                bgcolor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ mr: 2 }}
                    >
                        <Menu size={20} />
                    </IconButton>

                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            bgcolor: '#1e293b',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <Search size={16} style={{ opacity: 0.5, marginRight: 8 }} />
                        <Typography variant="body2" sx={{ opacity: 0.5 }}>Search transactions...</Typography>
                        <Box sx={{ ml: 4, px: 1, bgcolor: '#0f172a', borderRadius: 1, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700 }}>⌘K</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="View Logs">
                        <IconButton color="inherit" size="small" sx={{ color: 'text.secondary' }}>
                            <Monitor size={18} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications">
                        <IconButton color="inherit" size="small" sx={{ color: 'text.secondary' }}>
                            <Badge badgeContent={3} color="error" variant="dot">
                                <Bell size={18} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Nousheen Kiot</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>System Admin</Typography>
                        </Box>
                        <Avatar
                            alt="User Profile"
                            src="https://github.com/shadcn.png"
                            sx={{ width: 36, height: 36, border: '2px solid rgba(14, 165, 233, 0.3)' }}
                        />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
