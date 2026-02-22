import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Nav, Offcanvas } from 'react-bootstrap';
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
import { useAppSelector } from '../../store/hooks';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    variant: 'temporary' | 'persistent';
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
    const { username } = useParams<{ username: string }>();
    const mode = useAppSelector((state) => state.theme.mode);

    const menuItems = [
        { text: LABELS.NAVIGATION.DASHBOARD, icon: <LayoutDashboard size={20} />, path: PATHS.DASHBOARD.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.COHORT_MANAGEMENT, icon: <Users size={20} />, path: PATHS.COHORT.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.PROCESSING_RUNS, icon: <Zap size={20} />, path: PATHS.PROCESSING.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.CASHFLOWS, icon: <Database size={20} />, path: PATHS.CASHFLOW.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.REPORTS, icon: <FileText size={20} />, path: PATHS.REPORTS.replace(':username', username || '') },
        { text: LABELS.NAVIGATION.SETTINGS, icon: <Settings size={20} />, path: PATHS.SETTINGS.replace(':username', username || '') },
    ];

    const SidebarContent = (
        <div className={`h-100 d-flex flex-column ${mode === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark'} border-end border-secondary-subtle`}>
            <div className="p-4 d-flex align-items-center gap-3 border-bottom border-secondary-subtle">
                <div
                    className="rounded-1 bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                >
                    <Zap size={16} color="white" />
                </div>
                <h6 className="mb-0 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                    {LABELS.APP_NAME}
                </h6>
            </div>

            <Nav className="flex-column p-2 mt-2 gap-1 overflow-auto">
                {menuItems.map((item) => (
                    <Nav.Link
                        key={item.text}
                        as={NavLink}
                        to={item.path}
                        onClick={variant === 'temporary' ? onClose : undefined}
                        className={({ isActive }) => `
                            d-flex align-items-center px-3 py-2 rounded-2 text-decoration-none transition-all
                            ${isActive
                                ? 'bg-primary-subtle text-primary border-end border-primary border-3 rounded-end-0'
                                : `text-secondary ${mode === 'dark' ? 'hover-bg-secondary-subtle' : 'hover-bg-light-subtle'}`
                            }
                        `}
                        style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                        <span className="me-3 opacity-75">{item.icon}</span>
                        {item.text}
                    </Nav.Link>
                ))}
            </Nav>

            <style>{`
                .hover-bg-secondary-subtle:hover { background-color: rgba(255, 255, 255, 0.05); }
                .hover-bg-light-subtle:hover { background-color: rgba(0, 0, 0, 0.05); }
                .transition-all { transition: all 0.2s ease; }
            `}</style>
        </div>
    );

    if (variant === 'temporary') {
        return (
            <Offcanvas show={open} onHide={onClose} placement="start" style={{ width: '260px' }}>
                <Offcanvas.Body className="p-0">
                    {SidebarContent}
                </Offcanvas.Body>
            </Offcanvas>
        );
    }

    return (
        <div
            className="position-fixed h-100 d-none d-md-block"
            style={{
                width: '260px',
                zIndex: 1010,
                transform: open ? 'translateX(0)' : 'translateX(-260px)',
                transition: 'transform 0.25s ease-out'
            }}
        >
            {SidebarContent}
        </div>
    );
};

export default Sidebar;
