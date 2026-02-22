import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLoaderData, useSearchParams, useSubmit, useNavigation, useActionData, useParams } from 'react-router-dom';
import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router-dom';
import {
    Container, Row, Col, Card, Button, Form, Table,
    Pagination, Badge, Modal, InputGroup, Toast, ToastContainer,
    Spinner
} from 'react-bootstrap';
import {
    Plus, Search, Edit2, Eye, Trash2, RefreshCw, AlertCircle,
    ChevronUp, ChevronDown
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cohortApi } from '../api/cohortApi';
import type { Policy, Page } from '../types';
import { LABELS } from '../constants/labels';
import { useAppSelector } from '../store/hooks';
import { withAuth, withErrorLogging } from '../hoc';

// --- Validation Schema ---

const policySchema = z.object({
    policyNumber: z.string().min(1, LABELS.VALIDATION.POLICY_NUMBER_REQUIRED),
    holderName: z.string().min(1, LABELS.VALIDATION.HOLDER_NAME_REQUIRED),
    premium: z.coerce.number().min(0, LABELS.VALIDATION.PREMIUM_POSITIVE),
    fyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, LABELS.VALIDATION.INVALID_DATE_FORMAT),
    assumption: z.enum(['AGGRESSIVE', 'CONSERVATIVE', 'MODERATE'])
});

type PolicyFormData = z.infer<typeof policySchema>;

// --- Loader & Action ---

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
        return { data: null, error: LABELS.ERRORS.FAILED_TO_FETCH_COHORT };
    }
};

export const cohortAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const intent = formData.get('intent');

    try {
        if (intent === 'delete') {
            const id = Number(formData.get('id'));
            await cohortApi.delete(id);
            return { success: true, message: LABELS.SUCCESS.POLICY_DELETED };
        }

        const policyData = JSON.parse(formData.get('policyData') as string);
        if (intent === 'create') {
            await cohortApi.create(policyData);
            return { success: true, message: LABELS.SUCCESS.POLICY_CREATED };
        }

        if (intent === 'edit') {
            const id = Number(formData.get('id'));
            await cohortApi.update(id, policyData);
            return { success: true, message: LABELS.SUCCESS.POLICY_UPDATED };
        }

        return { success: false, error: LABELS.ERRORS.INVALID_INTENT };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : LABELS.ERRORS.ACTION_FAILED };
    }
};

// --- Component ---

const CohortManagement: React.FC = () => {
    const { data: loaderData, error: loaderError } = useLoaderData() as { data: Page<Policy> | null, error: string | null };
    const actionData = useActionData() as { success: boolean, message?: string, error?: string } | undefined;
    const [searchParams, setSearchParams] = useSearchParams();
    const { username } = useParams<{ username: string }>();
    const submit = useSubmit();
    const navigation = useNavigation();
    const mode = useAppSelector((state) => state.theme.mode);

    // Search Params
    const page = parseInt(searchParams.get('page') || '0', 10);
    const searchTerm = searchParams.get('query') || '';
    const orderBy = (searchParams.get('sortBy') || 'id') as keyof Policy;
    const order = (searchParams.get('sortDir') || 'asc') as 'asc' | 'desc';

    // Local UI state
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
    const [toast, setToast] = useState<{ show: boolean, message: string, variant: 'success' | 'danger' }>({
        show: false, message: '', variant: 'success'
    });

    const isLoading = navigation.state === 'loading';

    useEffect(() => {
        if (actionData) {
            if (actionData.success) {
                setToast({ show: true, message: actionData.message || LABELS.MESSAGES.OPERATION_SUCCESSFUL, variant: 'success' });
                handleCloseModal();
            } else if (actionData.error) {
                setToast({ show: true, message: actionData.error, variant: 'danger' });
            }
        }
    }, [actionData]);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<PolicyFormData>({
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
        if (selectedPolicy && (modalMode === 'edit' || modalMode === 'view')) {
            setValue('policyNumber', selectedPolicy.policyNumber);
            setValue('holderName', selectedPolicy.holderName);
            setValue('premium', selectedPolicy.premium);
            setValue('fyDate', selectedPolicy.fyDate);
            setValue('assumption', selectedPolicy.assumption);
        } else {
            reset();
        }
    }, [selectedPolicy, modalMode, setValue, reset]);

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ query: searchInput, page: 0 });
    };

    const handleOpenModal = (mode: 'create' | 'edit' | 'view', policy?: Policy) => {
        setModalMode(mode);
        setSelectedPolicy(policy || null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPolicy(null);
        reset();
    };

    const onSubmit: SubmitHandler<PolicyFormData> = (data) => {
        const formData = new FormData();
        formData.append('intent', modalMode);
        formData.append('policyData', JSON.stringify(data));
        if (selectedPolicy) {
            formData.append('id', String(selectedPolicy.id));
        }
        submit(formData, { method: 'post' });
    };

    const handleDelete = (id: number) => {
        if (window.confirm(LABELS.MESSAGES.POLICY_DELETE_CONFIRM)) {
            const formData = new FormData();
            formData.append('intent', 'delete');
            formData.append('id', String(id));
            submit(formData, { method: 'post' });
        }
    };

    const getAssumptionBadge = (assumption: string) => {
        switch (assumption) {
            case 'AGGRESSIVE': return <Badge bg="danger-subtle" className="text-danger fw-bold rounded-1 small" style={{ fontSize: '0.65rem' }}>AGGRESSIVE</Badge>;
            case 'CONSERVATIVE': return <Badge bg="success-subtle" className="text-success fw-bold rounded-1 small" style={{ fontSize: '0.65rem' }}>CONSERVATIVE</Badge>;
            default: return <Badge bg="warning-subtle" className="text-warning-emphasis fw-bold rounded-1 small" style={{ fontSize: '0.65rem' }}>MODERATE</Badge>;
        }
    };

    return (
        <Container fluid className="p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 border-bottom pb-3">
                <div>
                    <h4 className="fw-bold mb-1">{LABELS.PAGE_TITLES.COHORT_MANAGEMENT}</h4>
                    <p className="text-secondary small mb-0">{LABELS.PAGE_DESCRIPTIONS.COHORT_MANAGEMENT}</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => handleOpenModal('create')}
                    className="d-flex align-items-center gap-2 fw-bold px-4 shadow-sm"
                >
                    <Plus size={18} /> {LABELS.BUTTONS.ADD_NEW_COHORT}
                </Button>
            </div>

            <Card className={`border-0 shadow-sm rounded-4 overflow-hidden ${mode === 'dark' ? 'bg-dark text-white border border-secondary' : 'bg-white'}`}>
                <Card.Body className="p-0">
                    <div className="p-3 d-flex flex-column flex-md-row gap-3 align-items-md-center border-bottom border-light-subtle">
                        <Form onSubmit={handleSearch} className="flex-grow-1">
                            <InputGroup size="sm" className="rounded-2 border overflow-hidden" style={{ maxWidth: '450px' }}>
                                <InputGroup.Text className={mode === 'dark' ? 'bg-dark border-0 text-secondary' : 'bg-white border-0'}>
                                    <Search size={16} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder={LABELS.PLACEHOLDERS.SEARCH_COHORT}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className={`border-0 ${mode === 'dark' ? 'bg-dark text-white shadow-none' : 'shadow-none'}`}
                                />
                            </InputGroup>
                        </Form>
                        <div className="d-flex gap-2">
                            <Button variant="link" onClick={() => updateParams({ _cache: Date.now() })} className="p-2 text-secondary border rounded-2 border-secondary-subtle">
                                <RefreshCw size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <Table hover striped={mode === 'dark'} className={`mb-0 align-middle ${mode === 'dark' ? 'table-dark' : ''}`}>
                            <thead className={mode === 'dark' ? '' : 'table-light'}>
                                <tr style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th className="px-4 py-3" style={{ cursor: 'pointer' }} onClick={() => handleRequestSort('id')}>
                                        {LABELS.TABLE_HEADERS.ID} {orderBy === 'id' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </th>
                                    <th className="py-3 px-3" style={{ cursor: 'pointer' }} onClick={() => handleRequestSort('policyNumber')}>
                                        {LABELS.TABLE_HEADERS.POLICY_NUMBER} {orderBy === 'policyNumber' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </th>
                                    <th className="py-3 px-3" style={{ cursor: 'pointer' }} onClick={() => handleRequestSort('holderName')}>
                                        {LABELS.TABLE_HEADERS.HOLDER_NAME} {orderBy === 'holderName' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </th>
                                    <th className="py-3 px-3 text-end" style={{ cursor: 'pointer' }} onClick={() => handleRequestSort('premium')}>
                                        {LABELS.TABLE_HEADERS.PREMIUM} {orderBy === 'premium' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </th>
                                    <th className="py-3 px-3" style={{ cursor: 'pointer' }} onClick={() => handleRequestSort('fyDate')}>
                                        {LABELS.TABLE_HEADERS.FY_DATE} {orderBy === 'fyDate' && (order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </th>
                                    <th className="py-3 px-3">{LABELS.TABLE_HEADERS.ASSUMPTION}</th>
                                    <th className="py-3 px-4 text-end">{LABELS.TABLE_HEADERS.ACTIONS}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5">
                                            <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                                            <span className="text-secondary">Loading details...</span>
                                        </td>
                                    </tr>
                                ) : loaderError ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-danger">
                                            <AlertCircle size={24} className="mb-2" />
                                            <div>{loaderError}</div>
                                        </td>
                                    </tr>
                                ) : loaderData?.content?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-secondary">
                                            {LABELS.MESSAGES.NO_COHORTS_FOUND}
                                        </td>
                                    </tr>
                                ) : (
                                    loaderData?.content?.map((row) => (
                                        <tr key={row.id}>
                                            <td className="px-4 text-secondary small">#{row.id}</td>
                                            <td className="px-3 fw-bold">
                                                <RouterLink to={`/${username}/cohort/${row.id}`} className="text-primary text-decoration-none hover-underline">
                                                    {row.policyNumber}
                                                </RouterLink>
                                            </td>
                                            <td className="px-3 small">{row.holderName}</td>
                                            <td className="px-3 text-end fw-medium small">${row.premium.toLocaleString()}</td>
                                            <td className="px-3 text-secondary small">{row.fyDate}</td>
                                            <td className="px-3">{getAssumptionBadge(row.assumption)}</td>
                                            <td className="px-4 text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Button variant="link" size="sm" className="p-1 text-secondary" onClick={() => handleOpenModal('view', row)}><Eye size={16} /></Button>
                                                    <Button variant="link" size="sm" className="p-1 text-primary" onClick={() => handleOpenModal('edit', row)}><Edit2 size={16} /></Button>
                                                    <Button variant="link" size="sm" className="p-1 text-danger" onClick={() => handleDelete(row.id)}><Trash2 size={16} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 border-top border-secondary-subtle">
                        <div className="text-secondary small">
                            Showing <span className="fw-bold">{loaderData?.numberOfElements || 0}</span> of <span className="fw-bold">{loaderData?.totalElements || 0}</span> entries
                        </div>
                        <Pagination size="sm" className="mb-0">
                            <Pagination.Prev
                                disabled={page === 0}
                                onClick={() => updateParams({ page: page - 1 })}
                            />
                            {[...Array(loaderData?.totalPages || 0)].map((_, i) => (
                                <Pagination.Item
                                    key={i}
                                    active={i === page}
                                    onClick={() => updateParams({ page: i })}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            )).slice(Math.max(0, page - 2), Math.min(loaderData?.totalPages || 0, page + 3))}
                            <Pagination.Next
                                disabled={page === (loaderData?.totalPages || 1) - 1}
                                onClick={() => updateParams({ page: page + 1 })}
                            />
                        </Pagination>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={openModal} onHide={handleCloseModal} size="lg" centered className={mode === 'dark' ? 'modal-dark' : ''}>
                <Modal.Header closeButton className={mode === 'dark' ? 'bg-dark text-white border-secondary' : ''}>
                    <Modal.Title className="fw-bold h5">
                        {modalMode === 'create' ? LABELS.DIALOGS.CREATE_NEW_COHORT : modalMode === 'edit' ? LABELS.DIALOGS.EDIT_COHORT : LABELS.DIALOGS.COHORT_DETAILS}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body className={mode === 'dark' ? 'bg-dark text-white' : ''}>
                        <Row className="g-4">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Policy Number</Form.Label>
                                    <Controller
                                        name="policyNumber"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                {...field}
                                                isInvalid={!!errors.policyNumber}
                                                disabled={modalMode === 'view'}
                                                className={mode === 'dark' ? 'bg-dark border-secondary text-white' : ''}
                                                placeholder="Enter system policy ID"
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.policyNumber?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Policy Holder Name</Form.Label>
                                    <Controller
                                        name="holderName"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                {...field}
                                                isInvalid={!!errors.holderName}
                                                disabled={modalMode === 'view'}
                                                className={mode === 'dark' ? 'bg-dark border-secondary text-white' : ''}
                                                placeholder="Full legal name"
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.holderName?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Annual Premium ($)</Form.Label>
                                    <Controller
                                        name="premium"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                {...field}
                                                type="number"
                                                isInvalid={!!errors.premium}
                                                disabled={modalMode === 'view'}
                                                className={mode === 'dark' ? 'bg-dark border-secondary text-white' : ''}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.premium?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Financial Year Date</Form.Label>
                                    <Controller
                                        name="fyDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                {...field}
                                                type="date"
                                                isInvalid={!!errors.fyDate}
                                                disabled={modalMode === 'view'}
                                                className={mode === 'dark' ? 'bg-dark border-secondary text-white' : ''}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.fyDate?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold">Policy Assumption</Form.Label>
                                    <Controller
                                        name="assumption"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Select
                                                {...field}
                                                disabled={modalMode === 'view'}
                                                className={mode === 'dark' ? 'bg-dark border-secondary text-white' : ''}
                                            >
                                                <option value="AGGRESSIVE">{LABELS.ASSUMPTIONS.AGGRESSIVE}</option>
                                                <option value="MODERATE">{LABELS.ASSUMPTIONS.MODERATE}</option>
                                                <option value="CONSERVATIVE">{LABELS.ASSUMPTIONS.CONSERVATIVE}</option>
                                            </Form.Select>
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className={mode === 'dark' ? 'bg-dark border-secondary' : ''}>
                        <Button variant="link" onClick={handleCloseModal} className="text-secondary text-decoration-none">
                            {LABELS.BUTTONS.CANCEL}
                        </Button>
                        {modalMode !== 'view' && (
                            <Button type="submit" variant="primary" className="fw-bold px-4">
                                {modalMode === 'create' ? LABELS.BUTTONS.CREATE_COHORT : LABELS.BUTTONS.UPDATE_COHORT}
                            </Button>
                        )}
                    </Modal.Footer>
                </Form>
            </Modal>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    show={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                    delay={3000}
                    autohide
                    bg={toast.variant}
                >
                    <Toast.Body className="text-white fw-bold">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <style>{`
                .hover-underline:hover { text-decoration: underline !important; }
                .table-light th { font-weight: 700; color: #4b5563; }
                .modal-dark .modal-content { border-color: rgba(255,255,255,0.1); }
            `}</style>
        </Container>
    );
};

export default withErrorLogging(withAuth(CohortManagement));
