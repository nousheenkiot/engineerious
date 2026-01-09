import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import CashflowCalculator from '../components/CashflowCalculator';

const CashflowCalculatorPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { interestRate: number; premium: number; totalCashflow: number } | null;

    if (!state) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="warning">
                    No calculation data found. Please start from a Policy Details page.
                </Alert>
                <Button
                    startIcon={<ArrowLeft />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Button
                startIcon={<ArrowLeft />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back to PolicyDetails
            </Button>

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#111827' }}>
                Cashflow Projection
            </Typography>

            <CashflowCalculator
                interestRate={state.interestRate}
                premium={state.premium}
                totalCashflow={state.totalCashflow}
            />
        </Box>
    );
};

export default CashflowCalculatorPage;
