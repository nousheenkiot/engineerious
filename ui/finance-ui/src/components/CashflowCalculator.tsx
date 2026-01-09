import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import { LABELS } from '../constants/labels';

interface CashflowCalculatorProps {
    interestRate: number;
    premium: number;
    totalCashflow: number;
}

const CashflowCalculator: React.FC<CashflowCalculatorProps> = ({ interestRate, premium, totalCashflow }) => {
    // Logic: New Cashflow = Interest Rate(%) * Total Cashflow
    // Total Value = Premium Amount + New Cashflow

    // Calculate interest component based on total cashflow and rate
    const interestComponent = totalCashflow * (interestRate / 100);
    // Calculate total projected value using premium + interest
    const totalProjectedValue = premium + interestComponent;

    return (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 1, border: '1px solid #e5e7eb', bgcolor: '#fdfdff' }}>
            <Typography variant="subtitle2" sx={{ color: '#666666', mb: 2, fontWeight: 600, textTransform: 'uppercase' }}>
                {LABELS.CALCULATOR.PROJECTION_RESULTS.replace('{rate}', interestRate.toString())}
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                    <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 1, border: '1px solid #dcfce7', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TrendingUp size={16} color="#166534" />
                            <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>{LABELS.CALCULATOR.INTEREST_GENERATED}</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ color: '#166534', fontWeight: 700 }}>
                            ${interestComponent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            {LABELS.CALCULATOR.OF_CASHFLOWS.replace('{rate}', interestRate.toString())}
                        </Typography>
                    </Box>
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 1, border: '1px solid #dbeafe', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TrendingUp size={16} color="#1e40af" />
                            <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600 }}>{LABELS.CALCULATOR.TOTAL_PROJECTED_VALUE}</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ color: '#1e40af', fontWeight: 700 }}>
                            ${totalProjectedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            {LABELS.CALCULATOR.PREMIUM_PLUS_INTEREST}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default CashflowCalculator;
