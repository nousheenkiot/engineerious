import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
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
import { LABELS } from '../constants/labels';
import { useAppSelector } from '../store/hooks';
import { withAuth, withErrorLogging } from '../hoc';

const StatCard: React.FC<{ title: string; value: string; trend: string; isUp: boolean; icon: React.ReactNode }> = ({
    title, value, trend, isUp, icon
}) => {
    const mode = useAppSelector((state) => state.theme.mode);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-100"
        >
            <Card
                className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative stat-card transition-all ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white text-dark'}`}
            >
                <div
                    className={`position-absolute rounded-circle opacity-10 bg-${isUp ? 'success' : 'danger'}`}
                    style={{ top: '-10px', right: '-10px', width: '80px', height: '80px' }}
                />
                <Card.Body className="p-4 position-relative z-index-1">
                    <div className="d-flex justify-content-between mb-3">
                        <div
                            className={`p-2 rounded-3 d-flex align-items-center justify-content-center bg-${isUp ? 'success' : 'danger'}-subtle text-${isUp ? 'success' : 'danger'}`}
                            style={{ width: '42px', height: '42px' }}
                        >
                            {icon}
                        </div>
                        <Button variant="link" className="text-secondary p-0">
                            <MoreVertical size={16} />
                        </Button>
                    </div>
                    <div className="text-secondary small fw-medium mb-1">{title}</div>
                    <h3 className="fw-bold mb-2">{value}</h3>
                    <div className="d-flex align-items-center gap-2">
                        <div className={`badge bg-${isUp ? 'success' : 'danger'}-subtle text-${isUp ? 'success' : 'danger'} border-0 px-2 py-1`}>
                            <span className="d-flex align-items-center gap-1">
                                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {trend}
                            </span>
                        </div>
                        <span className="text-secondary" style={{ fontSize: '0.7rem' }}>{LABELS.STATS.VS_LAST_MONTH}</span>
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};

const Dashboard: React.FC = () => {
    const mode = useAppSelector((state) => state.theme.mode);

    return (
        <Container fluid className="p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">{LABELS.PAGE_TITLES.FINANCIAL_DASHBOARD}</h2>
                    <p className="text-secondary mb-0">{LABELS.PAGE_DESCRIPTIONS.FINANCIAL_DASHBOARD}</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" className="d-flex align-items-center gap-2 bg-transparent text-secondary border-secondary-subtle">
                        <RefreshCw size={18} /> {LABELS.BUTTONS.SYNC_SERVICES}
                    </Button>
                    <Button variant="primary" className="d-flex align-items-center gap-2 px-4 fw-bold shadow-sm">
                        <Plus size={18} /> {LABELS.BUTTONS.NEW_PROCESS}
                    </Button>
                </div>
            </div>

            <Row className="g-4 mb-4">
                <Col xs={12} sm={6} md={3}>
                    <StatCard title={LABELS.STATS.TOTAL_POLICIES} value="2,482" trend="+12.5%" isUp={true} icon={<Activity size={20} />} />
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <StatCard title={LABELS.STATS.PROCESSING_RUNS} value="142" trend="+4.3%" isUp={true} icon={<TrendingUp size={20} />} />
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <StatCard title={LABELS.STATS.AVERAGE_LATENCY} value="124ms" trend="-2.1%" isUp={false} icon={<Clock size={20} />} />
                </Col>
                <Col xs={12} sm={6} md={3}>
                    <StatCard title={LABELS.STATS.SYSTEM_HEALTH} value="99.9%" trend="+0.2%" isUp={true} icon={<Zap size={20} />} />
                </Col>
            </Row>

            <Row className="g-4">
                <Col xs={12} lg={8}>
                    <Card className={`border-0 shadow-sm rounded-4 h-100 ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white text-dark'}`} style={{ minHeight: '400px' }}>
                        <Card.Body className="p-4 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0">{LABELS.SECTIONS.PROCESSING_VOLUME}</h5>
                                <Button variant="link" className="text-primary text-decoration-none p-0 d-flex align-items-center gap-1 small fw-bold">
                                    {LABELS.BUTTONS.VIEW_DETAILS} <ArrowUpRight size={14} />
                                </Button>
                            </div>

                            <div className="flex-grow-1 d-flex align-items-end gap-2 px-2 pb-2">
                                {[40, 70, 45, 90, 65, 85, 55, 75, 50, 95, 80, 100].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        className="flex-grow-1 rounded-top"
                                        style={{
                                            background: `linear-gradient(180deg, ${i % 2 === 0 ? '#007bff' : '#6366f1'} 0%, rgba(0, 123, 255, 0.1) 100%)`,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={4}>
                    <Card className={`border-0 shadow-sm rounded-4 h-100 ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white text-dark'}`} style={{ minHeight: '400px' }}>
                        <Card.Body className="p-4 d-flex flex-column">
                            <h5 className="fw-bold mb-4">{LABELS.SECTIONS.LIVE_ACTIVITY}</h5>
                            <div className="d-flex flex-column gap-4">
                                {[
                                    { title: 'Processing Run #42', time: '2 mins ago', status: 'SUCCESS', color: 'success' },
                                    { title: 'New Policies Loaded', time: '15 mins ago', status: 'FINISHED', color: 'info' },
                                    { title: 'Sync with Cohort Service', time: '1 hour ago', status: 'FAILED', color: 'danger' },
                                    { title: 'Backup Completed', time: '3 hours ago', status: 'SUCCESS', color: 'success' },
                                ].map((activity, i) => (
                                    <div key={i} className="d-flex gap-3 align-items-start">
                                        <div
                                            className={`rounded-circle mt-1 shadow-sm bg-${activity.color}`}
                                            style={{
                                                width: '10px',
                                                height: '10px',
                                                flexShrink: 0,
                                                boxShadow: `0 0 8px var(--bs-${activity.color})`
                                            }}
                                        />
                                        <div>
                                            <div className="fw-bold small">{activity.title}</div>
                                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{activity.time} • {activity.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="link" className="mt-auto text-primary text-decoration-none fw-bold small p-0 text-center w-100 mt-4">
                                {LABELS.BUTTONS.VIEW_FULL_AUDIT_LOG}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <style>{`
                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .z-index-1 { z-index: 1; }
            `}</style>
        </Container>
    );
};

export default withErrorLogging(withAuth(Dashboard));
