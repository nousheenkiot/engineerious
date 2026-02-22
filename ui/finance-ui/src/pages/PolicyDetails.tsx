import React, { useState } from 'react';
import { useNavigate, useLoaderData, useNavigation, useParams } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import {
    Container, Row, Col, Card, Button, Breadcrumb, Table,
    Badge, Form, Spinner, Alert, InputGroup
} from 'react-bootstrap';
import { ArrowLeft, Database, Receipt, TrendingUp, Calendar, Calculator } from 'lucide-react';
import { cohortApi } from '../api/cohortApi';
import { cashflowApi } from '../api/cashflowApi';
import type { Policy } from '../types';
import type { Cashflow } from '../api/cashflowApi';
import { LABELS } from '../constants/labels';
import { PATHS } from '../routes/paths';
import { useAppSelector } from '../store/hooks';

export const policyDetailsLoader = async ({ params }: LoaderFunctionArgs) => {
    const id = Number(params.id);
    try {
        const policy = await cohortApi.getById(id);
        const cashflows = await cashflowApi.getByContractId(policy.policyNumber);
        return { policy, cashflows, error: null };
    } catch (error) {
        return { policy: null, cashflows: [], error: LABELS.ERRORS.FAILED_TO_LOAD_POLICY };
    }
};

const PolicyDetails: React.FC = () => {
    const { policy, cashflows, error } = useLoaderData() as { policy: Policy | null, cashflows: Cashflow[], error: string | null };
    const navigate = useNavigate();
    const navigation = useNavigation();
    const mode = useAppSelector((state) => state.theme.mode);

    const [calcInput, setCalcInput] = useState('');

    const { username } = useParams<{ username: string }>();
    const totalCashflow = cashflows?.reduce((sum, cf) => sum + (cf.status === 'SUCCESS' ? cf.amount : 0), 0) || 0;

    const handleCalculate = () => {
        const val = parseFloat(calcInput);
        if (!isNaN(val) && val > 0) {
            const calculatorPath = PATHS.CALCULATOR.replace(':username', username || '');
            navigate(calculatorPath, {
                state: {
                    interestRate: val,
                    premium: policy?.premium || 0,
                    totalCashflow: totalCashflow
                }
            });
        }
    };

    const isLoading = navigation.state === 'loading';

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error || !policy) {
        return (
            <Container className="p-4">
                <Alert variant="danger">{error || LABELS.MESSAGES.POLICY_NOT_FOUND}</Alert>
                <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none">
                    <ArrowLeft size={18} className="me-2" /> {LABELS.BUTTONS.BACK}
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4">
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item onClick={() => navigate(-1)} className="text-primary text-decoration-none" style={{ cursor: 'pointer' }}>
                    {LABELS.PAGE_TITLES.COHORT_MANAGEMENT}
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{LABELS.PAGE_TITLES.POLICY_DETAILS}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="d-flex align-items-center mb-5 gap-3">
                <Button
                    variant="outline-secondary"
                    className={`p-2 rounded-2 ${mode === 'dark' ? 'border-secondary text-white' : 'border-light-subtle'}`}
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} />
                </Button>
                <div>
                    <h4 className="fw-bold mb-0">{policy.policyNumber}</h4>
                    <p className="text-secondary small mb-0">{policy.holderName}</p>
                </div>
                <div className="ms-auto">
                    <Badge
                        bg={policy.assumption === 'AGGRESSIVE' ? 'danger' : 'primary'}
                        className="px-3 py-2 rounded-1 fw-bold"
                    >
                        {policy.assumption}
                    </Badge>
                </div>
            </div>

            <Row className="g-4 mb-4">
                <Col lg={6}>
                    <Card className={`border-0 shadow-sm rounded-4 h-100 ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
                        <Card.Body className="p-4">
                            <h6 className="text-uppercase text-secondary fw-bold mb-4 small" style={{ letterSpacing: '0.05em' }}>
                                {LABELS.SECTIONS.POLICY_SUMMARY}
                            </h6>

                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                                        <Receipt size={20} />
                                    </div>
                                    <div>
                                        <div className="text-secondary small">{LABELS.FORM_FIELDS.PREMIUM_AMOUNT}</div>
                                        <div className="fw-bold fs-5">${policy.premium.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <div className="text-secondary small">{LABELS.FORM_FIELDS.FINANCIAL_YEAR_DATE}</div>
                                        <div className="fw-medium">{policy.fyDate}</div>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <div className="text-secondary small">{LABELS.FORM_FIELDS.CURRENT_ASSUMPTION}</div>
                                        <div className="fw-medium">{policy.assumption}</div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className={`border-0 shadow-sm rounded-4 h-100 ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <Calculator size={18} className="text-secondary" />
                                <h6 className="text-uppercase text-secondary fw-bold mb-0 small" style={{ letterSpacing: '0.05em' }}>
                                    {LABELS.SECTIONS.SIMULATOR}
                                </h6>
                            </div>

                            <p className="text-secondary small mb-4">{LABELS.MESSAGES.CALCULATOR_PLACEHOLDER}</p>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Interest Rate (%)</Form.Label>
                                <InputGroup className="rounded-3 overflow-hidden border">
                                    <Form.Control
                                        type="number"
                                        placeholder={LABELS.PLACEHOLDERS.ENTER_INTEREST_RATE}
                                        value={calcInput}
                                        onChange={(e) => setCalcInput(e.target.value)}
                                        className={`border-0 shadow-none ${mode === 'dark' ? 'bg-dark text-white' : ''}`}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={handleCalculate}
                                        disabled={!calcInput}
                                        className="fw-bold px-4"
                                    >
                                        {LABELS.BUTTONS.CALCULATE}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className={`border-0 shadow-sm rounded-4 overflow-hidden ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
                <Card.Header className={`p-3 d-flex align-items-center gap-2 border-bottom border-light-subtle ${mode === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`}>
                    <Database size={18} className="text-secondary" />
                    <h6 className="fw-bold mb-0">{LABELS.SECTIONS.DETAILED_CASHFLOWS}</h6>
                </Card.Header>
                <div className="table-responsive" style={{ maxHeight: '400px' }}>
                    <Table hover className={`mb-0 align-middle ${mode === 'dark' ? 'table-dark' : ''}`}>
                        <thead className={mode === 'dark' ? '' : 'table-light'}>
                            <tr className="small text-uppercase fw-bold text-secondary" style={{ letterSpacing: '0.05em', position: 'sticky', top: 0, zIndex: 1 }}>
                                <th className="px-4 py-3">{LABELS.TABLE_HEADERS.ID}</th>
                                <th className="py-3">{LABELS.TABLE_HEADERS.DATE}</th>
                                <th className="py-3">{LABELS.TABLE_HEADERS.AMOUNT}</th>
                                <th className="py-3">{LABELS.TABLE_HEADERS.TYPE}</th>
                                <th className="py-3">{LABELS.TABLE_HEADERS.STATUS}</th>
                                <th className="px-4 py-3">{LABELS.TABLE_HEADERS.RECORDED_AT}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashflows?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-secondary">
                                        {LABELS.MESSAGES.NO_CASHFLOWS_RECORDED}
                                    </td>
                                </tr>
                            ) : (
                                cashflows?.map((cf) => (
                                    <tr key={cf.id}>
                                        <td className="px-4 text-secondary small">#{cf.id}</td>
                                        <td className="fw-medium small">{cf.cashflowDate}</td>
                                        <td className="fw-bold small">${cf.amount.toLocaleString()}</td>
                                        <td>
                                            <Badge bg="secondary-subtle" className="text-secondary-emphasis fw-bold rounded-1 small" style={{ fontSize: '0.65rem' }}>
                                                {cf.assumptionType}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge
                                                bg={cf.status === 'SUCCESS' ? 'success-subtle' : cf.status === 'REVERSED' ? 'danger-subtle' : 'secondary-subtle'}
                                                className={`fw-bold px-2 py-1 rounded-1 small text-${cf.status === 'SUCCESS' ? 'success' : cf.status === 'REVERSED' ? 'danger' : 'secondary'}`}
                                                style={{ fontSize: '0.65rem' }}
                                            >
                                                {cf.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 text-secondary" style={{ fontSize: '0.75rem' }}>
                                            {new Date(cf.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </Container>
    );
};

export default PolicyDetails;
