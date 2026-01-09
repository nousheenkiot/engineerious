import React, { useState } from 'react';
import { useNavigate, useLoaderData, useNavigation } from 'react-router-dom';
import type { LoaderFunctionArgs } from 'react-router-dom';
import {
    Box, Typography, Paper, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, Breadcrumbs, Link, CircularProgress, Alert, TextField,
    Grid
} from '@mui/material';
import { ArrowLeft, Database, Receipt, TrendingUp, Calendar, Calculator } from 'lucide-react';
import { cohortApi } from '../api/cohortApi';
import { cashflowApi } from '../api/cashflowApi';
import type { Policy } from '../types';
import type { Cashflow } from '../api/cashflowApi';
import { LABELS } from '../constants/labels';
import { PATHS } from '../routes/paths';

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

    const [calcInput, setCalcInput] = useState('');

    const totalCashflow = cashflows?.reduce((sum, cf) => sum + (cf.status === 'SUCCESS' ? cf.amount : 0), 0) || 0;

    const handleCalculate = () => {
        const val = parseFloat(calcInput);
        if (!isNaN(val) && val > 0) {
            navigate(PATHS.CALCULATOR, {
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !policy) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error || LABELS.MESSAGES.POLICY_NOT_FOUND}</Alert>
                <Button startIcon={<ArrowLeft />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>{LABELS.BUTTONS.BACK}</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header & Breadcrumbs */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/cohort')} sx={{ cursor: 'pointer' }}>
                        {LABELS.PAGE_TITLES.COHORT_MANAGEMENT}
                    </Link>
                    <Typography color="text.primary">{LABELS.PAGE_TITLES.POLICY_DETAILS}</Typography>
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
                {/* Policy Summary Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 1, border: '1px solid #e5e7eb' }}>
                        <Typography variant="subtitle2" sx={{ color: '#666666', mb: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {LABELS.SECTIONS.POLICY_SUMMARY}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Receipt size={20} color="#005bab" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">{LABELS.FORM_FIELDS.PREMIUM_AMOUNT}</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>${policy.premium.toLocaleString()}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Calendar size={20} color="#005bab" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">{LABELS.FORM_FIELDS.FINANCIAL_YEAR_DATE}</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{policy.fyDate}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TrendingUp size={20} color="#005bab" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">{LABELS.FORM_FIELDS.CURRENT_ASSUMPTION}</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{policy.assumption}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Calculator Input Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 1, border: '1px solid #e5e7eb' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Calculator size={18} color="#666666" />
                            <Typography variant="subtitle2" sx={{ color: '#666666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {LABELS.SECTIONS.SIMULATOR}
                            </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {LABELS.MESSAGES.CALCULATOR_PLACEHOLDER}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                            <TextField
                                label={LABELS.FORM_FIELDS.INTEREST_RATE}
                                size="small"
                                value={calcInput}
                                onChange={(e) => setCalcInput(e.target.value)}
                                type="number"
                                fullWidth
                                variant="outlined"
                                placeholder={LABELS.PLACEHOLDERS.ENTER_INTEREST_RATE}
                            />
                            <Button
                                variant="contained"
                                onClick={handleCalculate}
                                disabled={!calcInput}
                                sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
                            >
                                {LABELS.BUTTONS.CALCULATE}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Cashflow Table */}
                <Grid size={12}>
                    <Paper sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Database size={18} color="#666666" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{LABELS.SECTIONS.DETAILED_CASHFLOWS}</Typography>
                        </Box>
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{LABELS.TABLE_HEADERS.ID}</TableCell>
                                        <TableCell>{LABELS.TABLE_HEADERS.DATE}</TableCell>
                                        <TableCell>{LABELS.TABLE_HEADERS.AMOUNT}</TableCell>
                                        <TableCell>{LABELS.TABLE_HEADERS.TYPE}</TableCell>
                                        <TableCell>{LABELS.TABLE_HEADERS.STATUS}</TableCell>
                                        <TableCell>{LABELS.TABLE_HEADERS.RECORDED_AT}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cashflows?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                {LABELS.MESSAGES.NO_CASHFLOWS_RECORDED}
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
