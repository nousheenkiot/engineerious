import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { PATHS } from '../routes/paths';
import { useAppSelector } from '../store/hooks';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();
    const mode = useAppSelector((state) => state.theme.mode);

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: '80vh' }}>
            <Card className={`border-0 shadow-sm rounded-4 p-5 ${mode === 'dark' ? 'bg-dark text-white border border-danger-subtle' : 'bg-white'}`} style={{ maxWidth: '500px' }}>
                <Card.Body className="d-flex flex-column align-items-center">
                    <div
                        className="rounded-circle p-3 mb-4 d-flex align-items-center justify-content-center"
                        style={{
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            color: '#dc3545'
                        }}
                    >
                        <ShieldAlert size={48} />
                    </div>

                    <h2 className="fw-bold mb-3 text-danger">Access Denied</h2>
                    <p className="text-secondary mb-5">
                        You do not have the required permissions to access this page.
                        Please contact your administrator if you believe this is an error.
                    </p>

                    <div className="d-flex gap-3 w-100">
                        <Button
                            variant="outline-secondary"
                            className="flex-grow-1 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={18} /> Go Back
                        </Button>
                        <Button
                            variant="danger"
                            className="flex-grow-1 py-2 fw-bold rounded-3 shadow-sm"
                            onClick={() => navigate(PATHS.DASHBOARD.replace(':username', username || ''))}
                        >
                            Dashboard
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Unauthorized;
