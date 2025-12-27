import React from 'react';
import { Box, Typography, Paper, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PlayCircle } from 'lucide-react';

const ProcessingRuns: React.FC = () => {
    const mockRuns = [
        { id: '#PR-942', date: '2025-12-27', time: '14:23:10', status: 'SUCCESS', count: 1250 },
        { id: '#PR-941', date: '2025-12-26', time: '09:12:45', status: 'PARTIAL', count: 980 },
        { id: '#PR-940', date: '2025-12-25', time: '11:05:22', status: 'SUCCESS', count: 3200 },
        { id: '#PR-939', date: '2025-12-24', time: '16:45:18', status: 'FAILED', count: 0 },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Processing Runs</Typography>
                <Button variant="contained" color="primary" startIcon={<PlayCircle size={18} />}>Trigger New Run</Button>
            </Box>

            <TableContainer component={Paper} className="glass">
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Run ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date/Time</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Processed Items</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockRuns.map((run) => (
                            <TableRow key={run.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                <TableCell sx={{ fontWeight: 600 }}>{run.id}</TableCell>
                                <TableCell>
                                    <Typography variant="body2">{run.date}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{run.time}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={run.status}
                                        size="small"
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: run.status === 'SUCCESS' ? 'rgba(34, 197, 94, 0.1)' : run.status === 'FAILED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: run.status === 'SUCCESS' ? '#22c55e' : run.status === 'FAILED' ? '#ef4444' : '#f59e0b',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{run.count.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button size="small">View Logs</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProcessingRuns;
