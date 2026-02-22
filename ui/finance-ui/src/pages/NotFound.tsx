import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { PATHS } from '../routes/paths';
import { useAppSelector } from '../store/hooks';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();
    const mode = useAppSelector((state) => state.theme.mode);

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: '80vh' }}>
            <h1
                className={`fw-bold mb-0 ${mode === 'dark' ? 'text-white' : 'text-dark'}`}
                style={{ fontSize: '10rem', opacity: 0.1 }}
            >
                404
            </h1>
            <h2 className="fw-bold mb-3">Oops! Page not found</h2>
            <p className="text-secondary mb-5 maxWidth-500 mx-auto">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Button
                variant="primary"
                size="lg"
                className="px-5 py-3 fw-bold rounded-3 shadow-sm"
                onClick={() => navigate(PATHS.DASHBOARD.replace(':username', username || ''))}
            >
                Back to Dashboard
            </Button>

            <style>{`
                .maxWidth-500 { max-width: 500px; }
            `}</style>
        </Container>
    );
};

export default NotFound;
