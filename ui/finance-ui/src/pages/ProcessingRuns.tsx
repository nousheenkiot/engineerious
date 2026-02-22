import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import { PlayCircle, Filter, Search, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateFilter } from '../features/filters/filterSlice';
import { selectHasActivity } from '../features/auth/authSlice';
import { withAuth, withErrorLogging } from '../hoc';

const PAGE_ID = 'processingRuns';

const ProcessingRuns: React.FC = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.theme.mode);
    const filters = useAppSelector((state) => state.filters[PAGE_ID] || {});
    const canTriggerRun = useAppSelector(selectHasActivity('PROCESSING_RUN_CREATE'));

    const mockRuns = [
        { id: '#PR-942', date: '2025-12-27', time: '14:23:10', status: 'SUCCESS', count: 1250 },
        { id: '#PR-941', date: '2025-12-26', time: '09:12:45', status: 'PARTIAL', count: 980 },
        { id: '#PR-940', date: '2025-12-25', time: '11:05:22', status: 'SUCCESS', count: 3200 },
        { id: '#PR-939', date: '2025-12-24', time: '16:45:18', status: 'FAILED', count: 0 },
    ];

    const handleFilterChange = (key: string, value: any) => {
        dispatch(updateFilter({ pageId: PAGE_ID, key, value }));
    };

    const search = filters.search || '';
    const statusFilter = filters.status || 'ALL';

    const filteredRuns = mockRuns.filter(run => {
        const matchesSearch = run.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || run.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <Badge bg="success-subtle" className="text-success fw-bold px-2 py-1 rounded-1">SUCCESS</Badge>;
            case 'FAILED': return <Badge bg="danger-subtle" className="text-danger fw-bold px-2 py-1 rounded-1">FAILED</Badge>;
            default: return <Badge bg="warning-subtle" className="text-warning-emphasis fw-bold px-2 py-1 rounded-1">PARTIAL</Badge>;
        }
    };

    return (
        <Container fluid className="p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h4 className="fw-bold mb-0">Processing Runs</h4>
                {canTriggerRun && (
                    <Button variant="primary" className="d-flex align-items-center gap-2 fw-bold px-4 shadow-sm">
                        <PlayCircle size={18} /> Trigger New Run
                    </Button>
                )}
            </div>

            <Card className={`border-0 shadow-sm rounded-4 mb-4 ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
                <Card.Body className="p-3">
                    <Row className="g-3 align-items-center">
                        <Col xs="auto" className="text-secondary opacity-50">
                            <Filter size={20} />
                        </Col>
                        <Col xs={12} md={4} lg={3}>
                            <InputGroup size="sm" className="rounded-2 overflow-hidden border">
                                <InputGroup.Text className={mode === 'dark' ? 'bg-dark border-0 text-secondary' : 'bg-white border-0 text-secondary'}>
                                    <Search size={14} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search Run ID"
                                    value={search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className={`border-0 ${mode === 'dark' ? 'bg-dark text-white' : ''} shadow-none`}
                                />
                            </InputGroup>
                        </Col>
                        <Col xs={12} md={3} lg={2}>
                            <Form.Select
                                size="sm"
                                value={statusFilter}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className={`rounded-2 shadow-none ${mode === 'dark' ? 'bg-dark text-white border-secondary' : ''}`}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="SUCCESS">Success</option>
                                <option value="PARTIAL">Partial</option>
                                <option value="FAILED">Failed</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className={`border-0 shadow-sm rounded-4 overflow-hidden ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
                <div className="table-responsive">
                    <Table hover className={`mb-0 align-middle ${mode === 'dark' ? 'table-dark' : ''}`}>
                        <thead className={mode === 'dark' ? '' : 'table-light'}>
                            <tr className="small text-uppercase fw-bold text-secondary" style={{ letterSpacing: '0.05em' }}>
                                <th className="px-4 py-3">Run ID</th>
                                <th className="py-3">Date / Time</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Processed Items</th>
                                <th className="py-3 px-4 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRuns.map((run) => (
                                <tr key={run.id}>
                                    <td className="px-4 fw-bold">{run.id}</td>
                                    <td>
                                        <div className="fw-medium small">{run.date}</div>
                                        <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{run.time}</div>
                                    </td>
                                    <td>{getStatusBadge(run.status)}</td>
                                    <td className="small fw-medium">{run.count.toLocaleString()}</td>
                                    <td className="px-4 text-end">
                                        <Button variant="outline-primary" size="sm" className="rounded-2 d-inline-flex align-items-center gap-1">
                                            <FileText size={14} /> View Logs
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRuns.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-secondary">
                                        No runs found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </Container>
    );
};

export default withErrorLogging(withAuth(ProcessingRuns));
