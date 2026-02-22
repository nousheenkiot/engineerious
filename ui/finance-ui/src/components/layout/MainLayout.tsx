import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSelector } from '../../store/hooks';

const MainLayout: React.FC = () => {
    const mode = useAppSelector((state) => state.theme.mode);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
            else setSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`d-flex min-vh-100 ${mode === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                variant={isMobile ? 'temporary' : 'persistent'}
            />

            <main
                className="flex-grow-1 d-flex flex-column"
                style={{
                    marginLeft: (!isMobile && sidebarOpen) ? '260px' : '0',
                    transition: 'margin-left 0.25s ease-out',
                    width: '100%'
                }}
            >
                <Header onMenuClick={toggleSidebar} />
                <div className="flex-grow-1 p-0 d-flex flex-column">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
