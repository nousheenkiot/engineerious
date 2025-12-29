import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Button, TextField, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, MenuItem, Grid, InputAdornment, Tooltip, CircularProgress,
    TableSortLabel
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
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Cohort Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    onClick={() => handleOpenDialog('create')}
                    sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                >
                    Add New Cohort
                </Button>
            </Box>

            <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search policies..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={20} color="gray" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ minWidth: 300 }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['policies'] })}>
                            <RefreshCw size={20} />
                        </IconButton>
                    </Tooltip>
                </Box>

                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
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
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'error.main' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <AlertCircle size={20} />
                                            Failed to load data
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : data?.content?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        No policies found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.content?.map((row) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{row.policyNumber}</TableCell>
                                        <TableCell>{row.holderName}</TableCell>
                                        <TableCell align="right">${row.premium.toLocaleString()}</TableCell>
                                        <TableCell>{row.fyDate}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.assumption}
                                                size="small"
                                                color={
                                                    row.assumption === 'AGGRESSIVE' ? 'error' :
                                                        row.assumption === 'CONSERVATIVE' ? 'success' : 'warning'
                                                }
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View">
                                                <IconButton size="small" color="info" onClick={() => handleOpenDialog('view', row)}><Eye size={18} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" color="primary" onClick={() => handleOpenDialog('edit', row)}><Edit2 size={18} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(row.id)}><Trash2 size={18} /></IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data?.totalElements || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'create' ? 'Add New Cohort' : dialogMode === 'edit' ? 'Edit Cohort' : 'View Cohort'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="policyNumber"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Policy Number"
                                            fullWidth
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            disabled={dialogMode === 'view'}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="holderName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Holder Name"
                                            fullWidth
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
                                            label="Premium"
                                            type="number"
                                            fullWidth
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
                                            label="Financial Year Date"
                                            type="date"
                                            fullWidth
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
                                            label="Assumption"
                                            fullWidth
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
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Close</Button>
                        {dialogMode !== 'view' && (
                            <Button type="submit" variant="contained" disabled={createMutation.isPending || updateMutation.isPending}>
                                {dialogMode === 'create' ? 'Create' : 'Save Changes'}
                            </Button>
                        )}
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default CohortManagement;
