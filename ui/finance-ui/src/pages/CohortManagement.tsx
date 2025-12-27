import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Users, UserPlus } from 'lucide-react';

const CohortManagement: React.FC = () => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Cohort Management</Typography>
                <Button variant="contained" startIcon={<UserPlus size={18} />}>Add New Cohort</Button>
            </Box>
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, bgcolor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'rgba(14, 165, 233, 0.1)', color: 'primary.main', mb: 2 }}>
                    <Users size={48} />
                </Box>
                <Typography variant="h6">No cohorts found</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Start by loading policies from the external service or create a manual cohort.</Typography>
            </Paper>
        </Box>
    );
};

export default CohortManagement;
