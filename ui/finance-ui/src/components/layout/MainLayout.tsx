import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const MainLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} variant={isMobile ? 'temporary' : 'persistent'} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    ...(sidebarOpen && !isMobile && {
                        marginLeft: '260px',
                        transition: theme.transitions.create('margin', {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                }}
            >
                <Header onMenuClick={toggleSidebar} />
                <Box sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;
