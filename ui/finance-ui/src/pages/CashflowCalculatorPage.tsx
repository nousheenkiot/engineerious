import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { ArrowLeft, Calculator, TrendingUp } from 'lucide-react';
import CashflowCalculator from '../components/CashflowCalculator';
import { LABELS } from '../constants/labels';
import { useAppSelector } from '../store/hooks';

const CashflowCalculatorPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const mode = useAppSelector((state) => state.theme.mode);
    const state = location.state as { interestRate: number; premium: number; totalCashflow: number } | null;

    const [rate, setRate] = useState(state?.interestRate?.toString() || '');
    const [years, setYears] = useState('');
    const [calculatedPremium, setCalculatedPremium] = useState<number>(0);

    const handleCalculateNewPremium = () => {
        if (!state?.premium || !rate || !years) return;

        const r = parseFloat(rate);
        const t = parseFloat(years);
        const p = state.premium;

        if (isNaN(r) || isNaN(t)) return;

        // Formula: A = P(1 + r/100)^t
        const amount = p * Math.pow((1 + r / 100), t);
        setCalculatedPremium(amount);
    };

    if (!state) {
        return (
            <Container className="p-4 text-center">
                <Alert variant="warning" className="d-inline-block px-5 shadow-sm rounded-3">
                    {LABELS.MESSAGES.NO_CALCULATION_DATA}
                </Alert>
                <div className="mt-3">
                    <Button
                        variant="link"
                        onClick={() => navigate(-1)}
                        className="text-primary text-decoration-none fw-bold"
                    >
                        <ArrowLeft size={18} className="me-2" /> {LABELS.BUTTONS.GO_BACK}
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4">
            <Button
                variant="link"
                onClick={() => navigate(-1)}
                className="text-primary text-decoration-none fw-bold px-0 mb-4"
            >
                <ArrowLeft size={18} className="me-2" /> {LABELS.BUTTONS.BACK_TO_POLICY_DETAILS}
            </Button>

            <h4 className="fw-bold mb-4">{LABELS.PAGE_TITLES.CASHFLOW_PROJECTION}</h4>

            <Row className="g-4">
                <Col md={6}>
                    <Card className={`border-0 shadow-sm rounded-4 h-100 ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <Calculator size={20} className="text-secondary" />
                                <h6 className="fw-bold mb-0 text-uppercase small" style={{ letterSpacing: '0.05em' }}>{LABELS.SECTIONS.SIMULATOR}</h6>
                            </div>

                            <div className="d-grid gap-3">
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Interest Rate (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                        className={mode === 'dark' ? 'bg-dark border-secondary text-white' : ''}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Duration (Years)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={years}
                                        onChange={(e) => setYears(e.target.value)}
                                        className={mode === 'dark' ? 'bg-dark border-secondary text-white' : ''}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleCalculateNewPremium} className="fw-bold py-2 mt-2">
                                    {LABELS.BUTTONS.CALCULATE_NEW_PREMIUM}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    {calculatedPremium > 0 && (
                        <Card className={`border-0 shadow-sm rounded-4 h-100 border-start border-4 border-success ${mode === 'dark' ? 'bg-success-subtle bg-opacity-10 text-success' : 'bg-success-subtle bg-opacity-50 text-success-emphasis'}`}>
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <TrendingUp size={20} />
                                    <h6 className="fw-bold mb-0 small text-uppercase" style={{ letterSpacing: '0.05em' }}>{LABELS.FORM_FIELDS.NEW_PREMIUM}</h6>
                                </div>
                                <h2 className="fw-bold mb-2">
                                    ${calculatedPremium.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </h2>
                                <p className="text-secondary small mb-0">
                                    Based on {years} years at {rate}% interest compounding annually.
                                </p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            <CashflowCalculator
                interestRate={Number(rate)}
                premium={state.premium}
                totalCashflow={state.totalCashflow}
            />
        </Container>
    );
};

export default CashflowCalculatorPage;
