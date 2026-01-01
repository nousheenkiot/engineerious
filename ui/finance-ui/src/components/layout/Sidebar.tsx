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

const SidebarContainer = styled(Box)(() => ({
    width: 260,
    height: '100%',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
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
                sx: { width: 260, bgcolor: 'background.paper', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }
            }}
        >
            <SidebarContainer>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 15px rgba(14, 165, 233, 0.5)'
                        }}
                    >
                        <Zap size={18} color="white" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
                        FinanceEngine
                    </Typography>
                </Box>

                <Divider sx={{ opacity: 0.1 }} />

                <List sx={{ px: 2, py: 3 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                onClick={variant === 'temporary' ? onClose : undefined}
                                sx={{
                                    borderRadius: 2,
                                    '&.active': {
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '& .MuiListItemIcon-root': { color: 'white' }
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(14, 165, 233, 0.1)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </SidebarContainer>
        </Drawer>
    );
};

export default Sidebar;
