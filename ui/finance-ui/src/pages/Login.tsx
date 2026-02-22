import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, setLoading, setError } from '../features/auth/authSlice';
import { authApi } from '../api/authApi';
import { PATHS } from '../routes/paths';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useAppSelector((state) => state.auth);
    const mode = useAppSelector((state) => state.theme.mode);

    const from = location.state?.from?.pathname || PATHS.DASHBOARD;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await authApi.login({ username, password });
            dispatch(setCredentials(response));

            const redirectPath = from.includes(':username')
                ? from.replace(':username', response.user.username)
                : `/${response.user.username}${from === '/' ? '/dashboard' : from}`;

            navigate(redirectPath, { replace: true });
        } catch (err: any) {
            dispatch(setError(err.message || 'Login failed. Please check your credentials.'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div
            className={`min-vh-100 d-flex align-items-center py-5 ${mode === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
            style={{
                background: mode === 'dark'
                    ? 'linear-gradient(135deg, #0a1929 0%, #101f33 100%)'
                    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <Card
                            className={`border-0 shadow-sm rounded-4 ${mode === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white'}`}
                            style={{ border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)' }}
                        >
                            <Card.Body className="p-4 p-md-5 text-center">
                                <div
                                    className="d-inline-flex p-3 rounded-3 mb-4 text-white"
                                    style={{ backgroundColor: '#007bff' }}
                                >
                                    <ShieldCheck size={40} />
                                </div>
                                <h2 className="fw-bold mb-2">Welcome Back</h2>
                                <p className="text-secondary mb-5">Please enter your details to sign in</p>

                                {error && (
                                    <Alert variant="danger" className="text-start mb-4 rounded-3">
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleLogin} className="text-start">
                                    <Form.Group className="mb-4" controlId="loginUsername">
                                        <Form.Label className="fw-semibold small mb-2">Username</Form.Label>
                                        <InputGroup className="overflow-hidden rounded-3">
                                            <InputGroup.Text className={mode === 'dark' ? 'bg-dark border-secondary text-secondary' : 'bg-white border-end-0'}>
                                                <User size={20} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className={mode === 'dark' ? 'bg-dark text-white border-secondary' : 'border-start-0'}
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="loginPassword">
                                        <Form.Label className="fw-semibold small mb-2">Password</Form.Label>
                                        <InputGroup className="overflow-hidden rounded-3">
                                            <InputGroup.Text className={mode === 'dark' ? 'bg-dark border-secondary text-secondary' : 'bg-white border-end-0'}>
                                                <Lock size={20} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={mode === 'dark' ? 'bg-dark text-white border-secondary' : 'border-start-0 border-end-0'}
                                                required
                                            />
                                            <Button
                                                variant="link"
                                                className={`text-secondary p-2 ${mode === 'dark' ? 'bg-dark border-secondary' : 'bg-white border-start-0 border-top border-bottom border-end'}`}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="w-100 py-3 fw-bold rounded-3 mt-2 shadow-sm"
                                        variant="primary"
                                        disabled={loading || !username || !password}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                Signing In...
                                            </>
                                        ) : 'Sign In'}
                                    </Button>
                                </Form>

                                <div className="mt-5 pt-4 border-top border-secondary-subtle">
                                    <p className="text-secondary small mb-0">
                                        Don't have an account?{' '}
                                        <Button
                                            variant="link"
                                            className="p-0 text-primary fw-bold text-decoration-none"
                                            onClick={() => navigate(PATHS.REGISTER)}
                                        >
                                            Create Account
                                        </Button>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
