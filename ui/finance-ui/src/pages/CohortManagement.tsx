import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLoaderData, useSearchParams, useSubmit, useNavigation, useActionData } from 'react-router-dom';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, MenuItem, Grid, InputAdornment, Tooltip, CircularProgress,
    TableSortLabel, Link, Alert, Snackbar
} from '@mui/material';
import {
    Plus, Search, Edit2, Eye, Trash2, RefreshCw, AlertCircle
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cohortApi } from '../api/cohortApi';
import type { Policy, Page } from '../types';

const policySchema = z.object({
    policyNumber: z.string().min(1, 'Policy Number is required'),
    holderName: z.string().min(1, 'Holder Name is required'),
    premium: z.coerce.number().min(0, 'Premium must be positive'),
    fyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    assumption: z.enum(['AGGRESSIVE', 'CONSERVATIVE', 'MODERATE'])
});

type PolicyFormData = z.infer<typeof policySchema>;

export const cohortLoader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);
    const query = url.searchParams.get('query') || '';
    const sortBy = url.searchParams.get('sortBy') || 'id';
    const sortDir = (url.searchParams.get('sortDir') || 'asc') as 'asc' | 'desc';

    try {
        const data = await cohortApi.search({ page, size, query, sortBy, sortDir });
        return { data, error: null };
    } catch (error) {
        return { data: null, error: 'Failed to fetch cohort data' };
    }
};

export const cohortAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const intent = formData.get('intent');

    try {
        if (intent === 'delete') {
            const id = Number(formData.get('id'));
            await cohortApi.delete(id);
            return { success: true, message: 'Policy deleted successfully' };
        }

        const policyData = JSON.parse(formData.get('policyData') as string);
        if (intent === 'create') {
            await cohortApi.create(policyData);
            return { success: true, message: 'Policy created successfully' };
        }

        if (intent === 'edit') {
            const id = Number(formData.get('id'));
            await cohortApi.update(id, policyData);
            return { success: true, message: 'Policy updated successfully' };
        }

        return { success: false, error: 'Invalid intent' };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Action failed' };
    }
};

const CohortManagement: React.FC = () => {
    const { data: loaderData, error: loaderError } = useLoaderData() as { data: Page<Policy> | null, error: string | null };
    const actionData = useActionData() as { success: boolean, message?: string, error?: string } | undefined;
    const [searchParams, setSearchParams] = useSearchParams();
    const submit = useSubmit();
    const navigation = useNavigation();

    // Search Params
    const page = parseInt(searchParams.get('page') || '0', 10);
    const rowsPerPage = parseInt(searchParams.get('size') || '10', 10);
    const searchTerm = searchParams.get('query') || '';
    const orderBy = (searchParams.get('sortBy') || 'id') as keyof Policy;
    const order = (searchParams.get('sortDir') || 'asc') as 'asc' | 'desc';

    // Local UI state
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success'
    });

    const isLoading = navigation.state === 'loading';

    useEffect(() => {
        if (actionData) {
            if (actionData.success) {
                setSnackbar({ open: true, message: actionData.message || 'Operation successful', severity: 'success' });
                handleCloseDialog();
            } else if (actionData.error) {
                setSnackbar({ open: true, message: actionData.error, severity: 'error' });
            }
        }
    }, [actionData]);

    // Form
    const { control, handleSubmit, reset, setValue } = useForm<PolicyFormData>({
        resolver: zodResolver(policySchema) as any,
        defaultValues: {
            policyNumber: '',
            holderName: '',
            premium: 0,
            fyDate: new Date().toISOString().split('T')[0],
            assumption: 'MODERATE'
        }
    });

    useEffect(() => {
        if (selectedPolicy && (dialogMode === 'edit' || dialogMode === 'view')) {
            setValue('policyNumber', selectedPolicy.policyNumber);
            setValue('holderName', selectedPolicy.holderName);
            setValue('premium', selectedPolicy.premium);
            setValue('fyDate', selectedPolicy.fyDate);
            setValue('assumption', selectedPolicy.assumption);
        } else {
            reset();
        }
    }, [selectedPolicy, dialogMode, setValue, reset]);

    // Handlers
    const updateParams = (updates: Record<string, string | number>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
        });
        setSearchParams(newParams);
    };

    const handleRequestSort = (property: keyof Policy) => {
        const isAsc = orderBy === property && order === 'asc';
        updateParams({
            sortBy: property,
            sortDir: isAsc ? 'desc' : 'asc'
        });
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        updateParams({ page: newPage });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateParams({
            size: event.target.value,
            page: 0
        });
    };

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            updateParams({ query: searchInput, page: 0 });
        }
    };

    const handleOpenDialog = (mode: 'create' | 'edit' | 'view', policy?: Policy) => {
        setDialogMode(mode);
        setSelectedPolicy(policy || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPolicy(null);
        reset();
    };

    const onSubmit: SubmitHandler<PolicyFormData> = (data) => {
        const formData = new FormData();
        formData.append('intent', dialogMode);
        formData.append('policyData', JSON.stringify(data));
        if (selectedPolicy) {
            formData.append('id', String(selectedPolicy.id));
        }
        submit(formData, { method: 'post' });
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            const formData = new FormData();
            formData.append('intent', 'delete');
            formData.append('id', String(id));
            submit(formData, { method: 'post' });
        }
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center', borderBottom: '1px solid #e5e7eb', pb: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                        Cohort Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                        Manage insurance policy cohorts and financial year data.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    onClick={() => handleOpenDialog('create')}
                    sx={{ boxShadow: 'none', px: 3 }}
                >
                    Add New Cohort
                </Button>
            </Box>

            <Paper sx={{ width: '100%', mb: 2, borderRadius: 1, border: '1px solid #e5e7eb' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#ffffff' }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search by holder name or policy number..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearch}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} color="#666666" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ minWidth: 400, '& .MuiOutlinedInput-root': { bgcolor: '#fdfdfd' } }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Refresh Data">
                        <IconButton onClick={() => updateParams({ _cache: Date.now() })} sx={{ border: '1px solid #e5e7eb', borderRadius: 1 }}>
                            <RefreshCw size={18} />
                        </IconButton>
                    </Tooltip>
                </Box>

                <TableContainer>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 80 }}>
                                    <TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={() => handleRequestSort('id')}>
                                        ID
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel active={orderBy === 'policyNumber'} direction={orderBy === 'policyNumber' ? order : 'asc'} onClick={() => handleRequestSort('policyNumber')}>
                                        Policy Number
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel active={orderBy === 'holderName'} direction={orderBy === 'holderName' ? order : 'asc'} onClick={() => handleRequestSort('holderName')}>
                                        Holder Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">
                                    <TableSortLabel active={orderBy === 'premium'} direction={orderBy === 'premium' ? order : 'asc'} onClick={() => handleRequestSort('premium')}>
                                        Premium
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel active={orderBy === 'fyDate'} direction={orderBy === 'fyDate' ? order : 'asc'} onClick={() => handleRequestSort('fyDate')}>
                                        FY Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Assumption</TableCell>
                                <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <CircularProgress size={30} />
                                    </TableCell>
                                </TableRow>
                            ) : loaderError ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#dc2626' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <AlertCircle size={18} />
                                            <Typography variant="body2">{loaderError}</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : loaderData?.content?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#666666' }}>
                                        No cohorts found matching your search
                                    </TableCell>
                                </TableRow>
                            ) : (
                                loaderData?.content?.map((row) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell sx={{ color: '#666666' }}>{row.id}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            <Link
                                                component={RouterLink}
                                                to={`/cohort/${row.id}`}
                                                sx={{
                                                    color: '#005bab',
                                                    textDecoration: 'none',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {row.policyNumber}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{row.holderName}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 500 }}>${row.premium.toLocaleString()}</TableCell>
                                        <TableCell color="textSecondary">{row.fyDate}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.assumption}
                                                size="small"
                                                variant="filled"
                                                sx={{
                                                    borderRadius: '4px',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    height: 20,
                                                    bgcolor:
                                                        row.assumption === 'AGGRESSIVE' ? '#fef2f2' :
                                                            row.assumption === 'CONSERVATIVE' ? '#f0fdf4' : '#fffbeb',
                                                    color:
                                                        row.assumption === 'AGGRESSIVE' ? '#991b1b' :
                                                            row.assumption === 'CONSERVATIVE' ? '#166534' : '#92400e',
                                                    border: '1px solid transparent'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ pr: 2 }}>
                                            <IconButton size="small" sx={{ mr: 1, color: '#666666' }} onClick={() => handleOpenDialog('view', row)}><Eye size={16} /></IconButton>
                                            <IconButton size="small" sx={{ mr: 1, color: '#005bab' }} onClick={() => handleOpenDialog('edit', row)}><Edit2 size={16} /></IconButton>
                                            <IconButton size="small" sx={{ color: '#dc2626' }} onClick={() => handleDelete(row.id)}><Trash2 size={16} /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={loaderData?.totalElements || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: '1px solid #e5e7eb' }}
                />
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
                <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb', px: 3, py: 2 }}>
                    <Typography component="span" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        {dialogMode === 'create' ? 'Create New Cohort' : dialogMode === 'edit' ? 'Edit Cohort' : 'Cohort Details'}
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={2.5}>
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="policyNumber"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Policy number"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            disabled={dialogMode === 'view'}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="holderName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Policy holder name"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            disabled={dialogMode === 'view'}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="premium"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            label="Annual premium ($)"
                                            type="number"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            disabled={dialogMode === 'view'}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="fyDate"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Financial year date"
                                            type="date"
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            disabled={dialogMode === 'view'}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="assumption"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Policy assumption"
                                            fullWidth
                                            size="small"
                                            disabled={dialogMode === 'view'}
                                        >
                                            <MenuItem value="AGGRESSIVE">Aggressive</MenuItem>
                                            <MenuItem value="MODERATE">Moderate</MenuItem>
                                            <MenuItem value="CONSERVATIVE">Conservative</MenuItem>
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ borderTop: '1px solid #e5e7eb', px: 3, py: 2 }}>
                        <Button onClick={handleCloseDialog} sx={{ color: '#666666' }}>Cancel</Button>
                        {dialogMode !== 'view' && (
                            <Button type="submit" variant="contained" sx={{ boxShadow: 'none' }} disabled={navigation.state === 'submitting'}>
                                {dialogMode === 'create' ? 'Create Cohort' : 'Update Cohort'}
                            </Button>
                        )}
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CohortManagement;
