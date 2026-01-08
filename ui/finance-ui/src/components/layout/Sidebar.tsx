import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider,
    styled
} from '@mui/material';
import {
    LayoutDashboard,
    Users,
    Zap,
    FileText,
    Settings,
    Database
} from 'lucide-react';

import { PATHS } from '../../routes/paths';

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 260,
    height: '100%',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${theme.palette.divider}`,
}));

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    variant: 'temporary' | 'persistent';
}

const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: PATHS.DASHBOARD },
    { text: 'Cohort Management', icon: <Users size={20} />, path: PATHS.COHORT },
    { text: 'Processing Runs', icon: <Zap size={20} />, path: PATHS.PROCESSING },
    { text: 'Cashflows', icon: <Database size={20} />, path: PATHS.CASHFLOW },
    { text: 'Reports', icon: <FileText size={20} />, path: PATHS.REPORTS },
    { text: 'Settings', icon: <Settings size={20} />, path: PATHS.SETTINGS },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
    return (
        <Drawer
            open={open}
            onClose={onClose}
            variant={variant}
            PaperProps={{
                sx: { width: 260, bgcolor: 'background.paper', borderRight: '1px solid #e5e7eb' }
            }}
        >
            <SidebarContainer>
                <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '4px',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Zap size={16} color="white" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#005bab', fontSize: '1.1rem' }}>
                        FinanceEngine
                    </Typography>
                </Box>

                <Divider />

                <List sx={{ p: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                onClick={variant === 'temporary' ? onClose : undefined}
                                sx={{
                                    borderRadius: '4px',
                                    py: 1,
                                    '&.active': {
                                        bgcolor: '#e6eff7',
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                                        borderRight: '3px solid #005bab',
                                        borderRadius: '4px 0 0 4px',
                                    },
                                    '&:hover': {
                                        bgcolor: '#f3f4f6',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36, color: '#666666' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: 13,
                                        fontWeight: 500
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </SidebarContainer>
        </Drawer>
    );
};

export default Sidebar;
