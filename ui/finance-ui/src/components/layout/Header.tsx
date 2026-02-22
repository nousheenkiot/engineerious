import React from 'react';
import { Navbar, Nav, Container, Button, Badge, InputGroup, Form } from 'react-bootstrap';
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
    const initials = username ? username.slice(0, 2).toUpperCase() : 'U';

    return (
        <Navbar
            sticky="top"
            className={`px-3 py-2 border-bottom ${mode === 'dark' ? 'bg-dark border-secondary' : 'bg-white border-light-subtle'}`}
            style={{ zIndex: 1020, minHeight: '64px' }}
        >
            <Container fluid className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Button
                        variant="link"
                        className={`p-2 me-3 rounded-2 text-decoration-none border ${mode === 'dark' ? 'border-secondary text-white' : 'border-light-subtle text-dark'}`}
                        onClick={onMenuClick}
                    >
                        <Menu size={18} />
                    </Button>

                    <div className="d-none d-md-block" style={{ width: '300px' }}>
                        <InputGroup size="sm" className="rounded-2 border">
                            <InputGroup.Text className={mode === 'dark' ? 'bg-dark border-0 text-secondary' : 'bg-transparent border-0'}>
                                <Search size={14} />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Global search..."
                                className={`border-0 ${mode === 'dark' ? 'bg-dark text-white shadow-none' : 'bg-transparent shadow-none'}`}
                                readOnly
                            />
                        </InputGroup>
                    </div>
                </div>

                <Nav className="align-items-center gap-2">
                    <Button
                        variant="link"
                        size="sm"
                        className={`p-2 text-decoration-none ${mode === 'dark' ? 'text-secondary-emphasis' : 'text-secondary'}`}
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </Button>

                    <Button
                        variant="link"
                        size="sm"
                        className={`p-2 d-none d-sm-block text-decoration-none ${mode === 'dark' ? 'text-secondary-emphasis' : 'text-secondary'}`}
                    >
                        <Monitor size={18} />
                    </Button>

                    <Button
                        variant="link"
                        size="sm"
                        className={`p-1 position-relative text-decoration-none ${mode === 'dark' ? 'text-secondary-emphasis' : 'text-secondary'}`}
                    >
                        <Bell size={18} />
                        <Badge
                            pill
                            bg="primary"
                            className="position-absolute translate-middle-y translate-middle-x"
                            style={{ top: '8px', right: '-4px', fontSize: '0.6rem' }}
                        >
                            3
                        </Badge>
                    </Button>

                    <div className="d-flex align-items-center ms-3">
                        <div className="text-end me-3 d-none d-sm-block">
                            <div className={`fw-bold small lh-1 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}>{displayName}</div>
                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>System User</div>
                        </div>
                        <div
                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-white bg-primary`}
                            style={{
                                width: '34px',
                                height: '34px',
                                fontSize: '0.85rem',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            {initials}
                        </div>
                    </div>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
