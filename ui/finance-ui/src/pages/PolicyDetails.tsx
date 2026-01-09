import { useNavigate, useLoaderData, useNavigation } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import {
    Box, Typography, Paper, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, Breadcrumbs, Link, CircularProgress, Alert, Grid
} from '@mui/material';
import { ArrowLeft, Database, Receipt, TrendingUp, Calendar } from 'lucide-react';
import { cohortApi } from '../api/cohortApi';
import { cashflowApi } from '../api/cashflowApi';
import type { Policy } from '../types';
import type { Cashflow } from '../api/cashflowApi';

export const policyDetailsLoader = async ({ params }: LoaderFunctionArgs) => {
    const id = Number(params.id);
    try {
        const policy = await cohortApi.getById(id);
        const cashflows = await cashflowApi.getByContractId(policy.policyNumber);
        return { policy, cashflows, error: null };
    } catch (error) {
        return { policy: null, cashflows: [], error: 'Failed to load policy or cashflow details' };
    }
};

const PolicyDetails: React.FC = () => {
    const { policy, cashflows, error } = useLoaderData() as { policy: Policy | null, cashflows: Cashflow[], error: string | null };
    const navigate = useNavigate();
    const navigation = useNavigation();

    const isLoading = navigation.state === 'loading';

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !policy) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error || 'Policy not found'}</Alert>
                <Button startIcon={<ArrowLeft />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>Back</Button>
            </Box>
        );
    }

    const totalCashflow = cashflows?.reduce((sum, cf) => sum + (cf.status === 'SUCCESS' ? cf.amount : 0), 0) || 0;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header & Breadcrumbs */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/cohort')} sx={{ cursor: 'pointer' }}>
                        Cohort Management
                    </Link>
                    <Typography color="text.primary">Policy Details</Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ border: '1px solid #e5e7eb' }}>
                        <ArrowLeft size={18} />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {policy.policyNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {policy.holderName}
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip
                        label={policy.assumption}
                        color={policy.assumption === 'AGGRESSIVE' ? 'error' : 'primary'}
                        sx={{ borderRadius: 1, fontWeight: 600 }}
                    />
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Policy Summary Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 1, border: '1px solid #e5e7eb' }}>
                        <Typography variant="subtitle2" sx={{ color: '#666666', mb: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Policy Summary
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Receipt size={20} color="#005bab" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Premium Amount</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>${policy.premium.toLocaleString()}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Calendar size={20} color="#005bab" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Financial Year Date</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{policy.fyDate}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TrendingUp size={20} color="#005bab" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Current Assumption</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{policy.assumption}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Financial Stats Card */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 1, border: '1px solid #e5e7eb', bgcolor: '#ffffff' }}>
                        <Typography variant="subtitle2" sx={{ color: '#666666', mb: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Financial Indicators
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 1, border: '1px solid #dcfce7' }}>
                                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>Total Cashflow (Sum)</Typography>
                                    <Typography variant="h5" sx={{ color: '#166534', fontWeight: 700, mt: 1 }}>
                                        ${totalCashflow.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 1, border: '1px solid #dbeafe' }}>
                                    <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600 }}>Cashflow Count</Typography>
                                    <Typography variant="h5" sx={{ color: '#1e40af', fontWeight: 700, mt: 1 }}>
                                        {cashflows?.length || 0}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box sx={{ p: 2, bgcolor: '#fffbeb', borderRadius: 1, border: '1px solid #fef3c7' }}>
                                    <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 600 }}>Pending Reversals</Typography>
                                    <Typography variant="h5" sx={{ color: '#92400e', fontWeight: 700, mt: 1 }}>
                                        {cashflows?.filter(cf => cf.status === 'REVERSED').length || 0}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Cashflow Table */}
                <Grid size={12}>
                    <Paper sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Database size={18} color="#666666" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Detailed Cashflows</Typography>
                        </Box>
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Recorded At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cashflows?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                No cashflows recorded for this policy.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        cashflows?.map((cf) => (
                                            <TableRow key={cf.id} hover>
                                                <TableCell sx={{ color: '#666666' }}>{cf.id}</TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{cf.cashflowDate}</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>${cf.amount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Chip label={cf.assumptionType} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={cf.status}
                                                        size="small"
                                                        sx={{
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            bgcolor: cf.status === 'SUCCESS' ? '#f0fdf4' : cf.status === 'REVERSED' ? '#fef2f2' : '#f9fafb',
                                                            color: cf.status === 'SUCCESS' ? '#166534' : cf.status === 'REVERSED' ? '#991b1b' : '#666666'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                                    {new Date(cf.createdAt).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PolicyDetails;
