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
import { LABELS } from '../../constants/labels';

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 260,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${theme.palette.divider}`,
}));

import { useParams } from 'react-router-dom';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    variant: 'temporary' | 'persistent';
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
    const { username } = useParams<{ username: string }>();

    const menuItems = [
        { text: LABELS.NAVIGATION.DASHBOARD, icon: <LayoutDashboard size={20} />, path: PATHS.DASHBOARD.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.COHORT_MANAGEMENT, icon: <Users size={20} />, path: PATHS.COHORT.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.PROCESSING_RUNS, icon: <Zap size={20} />, path: PATHS.PROCESSING.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.CASHFLOWS, icon: <Database size={20} />, path: PATHS.CASHFLOW.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.REPORTS, icon: <FileText size={20} />, path: PATHS.REPORTS.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.SETTINGS, icon: <Settings size={20} />, path: PATHS.SETTINGS.replace(':username', username || '') },
    ];

    return (
        <Drawer
            open={open}
            onClose={onClose}
            variant={variant}
            PaperProps={{
                sx: { width: 260, bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' }
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
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.1rem' }}>
                        {LABELS.APP_NAME}
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
                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(77, 171, 245, 0.12)' : '#e6eff7',
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                                        borderRight: (theme) => `3px solid ${theme.palette.primary.main}`,
                                        borderRadius: '4px 0 0 4px',
                                    },
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
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
