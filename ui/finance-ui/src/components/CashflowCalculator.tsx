import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { TrendingUp } from 'lucide-react';
import { LABELS } from '../constants/labels';
import { useAppSelector } from '../store/hooks';

interface CashflowCalculatorProps {
    interestRate: number;
    premium: number;
    totalCashflow: number;
}

const CashflowCalculator: React.FC<CashflowCalculatorProps> = ({ interestRate, premium, totalCashflow }) => {
    const mode = useAppSelector((state) => state.theme.mode);

    // Logic: New Cashflow = Interest Rate(%) * Total Cashflow
    // Total Value = Premium Amount + New Cashflow

    // Calculate interest component based on total cashflow and rate
    const interestComponent = totalCashflow * (interestRate / 100);
    // Calculate total projected value using premium + interest
    const totalProjectedValue = premium + interestComponent;

    return (
        <Card className={`border-0 shadow-sm rounded-4 p-4 mt-4 ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
            <Card.Body className="p-0">
                <h6 className="text-secondary fw-bold text-uppercase mb-4 small" style={{ letterSpacing: '0.05em' }}>
                    {LABELS.CALCULATOR.PROJECTION_RESULTS.replace('{rate}', interestRate.toString())}
                </h6>

                <Row className="g-3">
                    <Col xs={6}>
                        <div className={`p-3 rounded-4 h-100 text-center border ${mode === 'dark' ? 'bg-success-subtle border-success text-success' : 'bg-success-subtle border-success-subtle text-success-emphasis text-success'}`}>
                            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                <TrendingUp size={16} />
                                <span className="small fw-bold text-uppercase">{LABELS.CALCULATOR.INTEREST_GENERATED}</span>
                            </div>
                            <h4 className="fw-bold mb-1">
                                ${interestComponent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </h4>
                            <div className="small opacity-75" style={{ fontSize: '0.7rem' }}>
                                {LABELS.CALCULATOR.OF_CASHFLOWS.replace('{rate}', interestRate.toString())}
                            </div>
                        </div>
                    </Col>

                    <Col xs={6}>
                        <div className={`p-3 rounded-4 h-100 text-center border ${mode === 'dark' ? 'bg-primary-subtle border-primary text-primary' : 'bg-primary-subtle border-primary-subtle text-primary-emphasis text-primary'}`}>
                            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                <TrendingUp size={16} />
                                <span className="small fw-bold text-uppercase">{LABELS.CALCULATOR.TOTAL_PROJECTED_VALUE}</span>
                            </div>
                            <h4 className="fw-bold mb-1">
                                ${totalProjectedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </h4>
                            <div className="small opacity-75" style={{ fontSize: '0.7rem' }}>
                                {LABELS.CALCULATOR.PREMIUM_PLUS_INTEREST}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default CashflowCalculator;
