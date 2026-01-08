import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const CashflowManagement: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, borderBottom: '1px solid #e5e7eb', pb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Cashflow Management
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                    Record principal inflows and track IFRS 17 CSM updates.
                </Typography>
            </Box>

            <Paper
                sx={{
                    p: 8,
                    textAlign: 'center',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    border: '1px solid #e5e7eb',
                }}
            >
                <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 500 }}>
                    Cashflow recording interface coming soon...
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mt: 2 }}>
                    Integrates with the Saga Choreography pattern for automated CSM adjustments.
                </Typography>
            </Paper>
        </Box>
    );
};

export default CashflowManagement;
