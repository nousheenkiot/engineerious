import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, Grid, Paper, TextField } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import CashflowCalculator from '../components/CashflowCalculator';
import { LABELS } from '../constants/labels';

const CashflowCalculatorPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
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
            <Box sx={{ p: 4 }}>
                <Alert severity="warning">
                    {LABELS.MESSAGES.NO_CALCULATION_DATA}
                </Alert>
                <Button
                    startIcon={<ArrowLeft />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    {LABELS.BUTTONS.GO_BACK}
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
                {LABELS.BUTTONS.BACK_TO_POLICY_DETAILS}
            </Button>

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#111827' }}>
                {LABELS.PAGE_TITLES.CASHFLOW_PROJECTION}
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 1 }}>
                        <Typography variant="h6" gutterBottom>{LABELS.SECTIONS.SIMULATOR}</Typography>
                        <Box sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label={LABELS.FORM_FIELDS.INTEREST_RATE}
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                type="number"
                                fullWidth
                            />
                            <TextField
                                label={LABELS.FORM_FIELDS.YEARS}
                                value={years}
                                onChange={(e) => setYears(e.target.value)}
                                type="number"
                                fullWidth
                            />
                            <Button variant="contained" onClick={handleCalculateNewPremium}>
                                {LABELS.BUTTONS.CALCULATE_NEW_PREMIUM}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    {calculatedPremium > 0 && (
                        <Paper sx={{ p: 3, borderRadius: 1, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                            <Typography variant="subtitle2" sx={{ color: '#166534', fontWeight: 600 }}>
                                {LABELS.FORM_FIELDS.NEW_PREMIUM}
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#166534', fontWeight: 700, mt: 1 }}>
                                ${calculatedPremium.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Based on {years} years at {rate}% interest.
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <CashflowCalculator
                    interestRate={Number(rate)}
                    premium={state.premium}
                    totalCashflow={state.totalCashflow}
                />
            </Box>
        </Box>
    );
};

export default CashflowCalculatorPage;
