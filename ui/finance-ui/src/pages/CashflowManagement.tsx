import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { LABELS } from '../constants/labels';

const CashflowManagement: React.FC = () => {
    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Box sx={{ mb: 4, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {LABELS.PAGE_TITLES.CASHFLOW_MANAGEMENT}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {LABELS.PAGE_DESCRIPTIONS.CASHFLOW_MANAGEMENT}
                </Typography>
            </Box>

            <Paper
                sx={{
                    p: 8,
                    textAlign: 'center',
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {LABELS.MESSAGES.CASHFLOW_INTERFACE_COMING_SOON}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                    {LABELS.MESSAGES.CASHFLOW_SAGA_INTEGRATION}
                </Typography>
            </Paper>
        </Box>
    );
};

export default CashflowManagement;
