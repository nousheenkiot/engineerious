import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    IconButton,
    Card,
    CardContent
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    MoreVertical,
    ArrowUpRight,
    RefreshCw,
    Plus,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard: React.FC<{ title: string; value: string; trend: string; isUp: boolean; icon: React.ReactNode }> = ({
    title, value, trend, isUp, icon
}) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                }
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 80,
                    height: 80,
                    bgcolor: isUp ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 0
                }} />
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: isUp ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: isUp ? '#22c55e' : '#ef4444'
                        }}>
                            {icon}
                        </Box>
                        <IconButton size="small"><MoreVertical size={16} /></IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>{title}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>{value}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: isUp ? '#22c55e' : '#ef4444',
                            bgcolor: isUp ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            px: 0.5,
                            borderRadius: 1
                        }}>
                            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <Typography variant="caption" sx={{ fontWeight: 700, ml: 0.5 }}>{trend}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>vs last month</Typography>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const Dashboard: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Financial Dashboard</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Welcome back, here's what happening with your projects today.</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" startIcon={<RefreshCw size={18} />} sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>Sync Services</Button>
                    <Button variant="contained" startIcon={<Plus size={18} />} color="primary">New Process</Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Total Policies" value="2,482" trend="+12.5%" isUp={true} icon={<Activity size={24} />} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Processing Runs" value="142" trend="+4.3%" isUp={true} icon={<TrendingUp size={24} />} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="Average Latency" value="124ms" trend="-2.1%" isUp={false} icon={<Clock size={24} />} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard title="System Health" value="99.9%" trend="+0.2%" isUp={true} icon={<Zap size={24} />} />
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Processing Volume</Typography>
                            <Button size="small" endIcon={<ArrowUpRight size={16} />}>View Details</Button>
                        </Box>

                        {/* Placeholder for a chart - real app would use Recharts/Chart.js */}
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', gap: 2, px: 2, pb: 2 }}>
                            {[40, 70, 45, 90, 65, 85, 55, 75, 50, 95, 80, 100].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    style={{
                                        flex: 1,
                                        background: `linear-gradient(180deg, ${i % 2 === 0 ? '#0ea5e9' : '#6366f1'} 0%, rgba(14, 165, 233, 0.1) 100%)`,
                                        borderRadius: '4px 4px 0 0',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Live Activity</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {[
                                { title: 'Processing Run #42', time: '2 mins ago', status: 'SUCCESS', color: '#22c55e' },
                                { title: 'New Policies Loaded', time: '15 mins ago', status: 'FINISHED', color: '#0ea5e9' },
                                { title: 'Sync with Cohort Service', time: '1 hour ago', status: 'FAILED', color: '#ef4444' },
                                { title: 'Backup Completed', time: '3 hours ago', status: 'SUCCESS', color: '#22c55e' },
                            ].map((activity, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: activity.color, mt: 0.5, boxShadow: `0 0 10px ${activity.color}` }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.title}</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{activity.time} • {activity.status}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Button variant="text" sx={{ mt: 'auto' }}>View Full Audit Log</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
