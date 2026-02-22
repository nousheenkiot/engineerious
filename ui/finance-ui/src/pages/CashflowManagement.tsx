import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { LABELS } from '../constants/labels';
import { useAppSelector } from '../store/hooks';

const CashflowManagement: React.FC = () => {
    const mode = useAppSelector((state) => state.theme.mode);

    return (
        <Container fluid className="p-4">
            <div className="mb-4 border-bottom pb-3">
                <h4 className="fw-bold mb-1">{LABELS.PAGE_TITLES.CASHFLOW_MANAGEMENT}</h4>
                <p className="text-secondary small mb-0">{LABELS.PAGE_DESCRIPTIONS.CASHFLOW_MANAGEMENT}</p>
            </div>

            <Card className={`border-0 shadow-sm rounded-4 p-5 text-center ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
                <Card.Body className="py-5">
                    <h5 className="fw-bold mb-3">{LABELS.MESSAGES.CASHFLOW_INTERFACE_COMING_SOON}</h5>
                    <p className="text-secondary mb-0">{LABELS.MESSAGES.CASHFLOW_SAGA_INTEGRATION}</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CashflowManagement;
