import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, MenuItem, Grid, InputAdornment, Tooltip, CircularProgress,
    TableSortLabel, Link
} from '@mui/material';
import {
    Plus, Search, Edit2, Eye, Trash2, RefreshCw, AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cohortApi } from '../api/cohortApi';
import type { Policy } from '../types';

const policySchema = z.object({
    policyNumber: z.string().min(1, 'Policy Number is required'),
    holderName: z.string().min(1, 'Holder Name is required'),
    premium: z.coerce.number().min(0, 'Premium must be positive'),
    fyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    assumption: z.enum(['AGGRESSIVE', 'CONSERVATIVE', 'MODERATE'])
});

type PolicyFormData = z.infer<typeof policySchema>;

const CohortManagement: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState<keyof Policy>('id');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    // Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

    // Queries
    const { data, isLoading, isError } = useQuery({
        queryKey: ['policies', page, rowsPerPage, searchTerm, orderBy, order],
        queryFn: () => cohortApi.search({
            page,
            size: rowsPerPage,
            query: searchTerm,
            sortBy: orderBy,
            sortDir: order
        }),
        placeholderData: (previousData) => previousData
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: cohortApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['policies'] });
            handleCloseDialog();
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: number, policy: Partial<Policy> }) => cohortApi.update(data.id, data.policy),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['policies'] });
            handleCloseDialog();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: cohortApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['policies'] });
        }
    });

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
    const handleRequestSort = (property: keyof Policy) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
        if (dialogMode === 'create') {
            createMutation.mutate(data);
        } else if (dialogMode === 'edit' && selectedPolicy) {
            updateMutation.mutate({ id: selectedPolicy.id, policy: data });
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
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['policies'] })} sx={{ border: '1px solid #e5e7eb', borderRadius: 1 }}>
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
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#dc2626' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <AlertCircle size={18} />
                                            <Typography variant="body2">Failed to load cohort data</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : data?.content?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#666666' }}>
                                        No cohorts found matching your search
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.content?.map((row) => (
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
                                            <IconButton size="small" sx={{ color: '#dc2626' }} onClick={() => deleteMutation.mutate(row.id)}><Trash2 size={16} /></IconButton>
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
                    count={data?.totalElements || 0}
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
                            <Button type="submit" variant="contained" sx={{ boxShadow: 'none' }} disabled={createMutation.isPending || updateMutation.isPending}>
                                {dialogMode === 'create' ? 'Create Cohort' : 'Update Cohort'}
                            </Button>
                        )}
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default CohortManagement;
