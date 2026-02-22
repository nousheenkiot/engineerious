import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, ProgressBar, InputGroup } from 'react-bootstrap';
import {
    User, Mail, Lock, Phone, MapPin, Globe, Home, Building2,
    ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PATHS } from '../routes/paths';
import { useAppSelector } from '../store/hooks';

// --- Validation Schema ---

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().min(10, 'Invalid phone number'),
    country: z.string().min(1, 'Country is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    pinCode: z.string().min(6, 'Pin code must be 6 digits'),
    currentAddress: z.string().min(5, 'Current address is required'),
    isHomeSameAsCurrent: z.enum(['yes', 'no']),
    homeAddress: z.string().optional(),
}).refine((data) => {
    if (data.isHomeSameAsCurrent === 'no' && (!data.homeAddress || data.homeAddress.length < 5)) {
        return false;
    }
    return true;
}, {
    message: "Home address is required when it's different from current address",
    path: ["homeAddress"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// --- Mock Data ---

const countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' }
];

const statesByCountry: Record<string, { code: string, name: string }[]> = {
    IN: [
        { code: 'KA', name: 'Karnataka' },
        { code: 'MH', name: 'Maharashtra' },
        { code: 'DL', name: 'Delhi' }
    ],
    US: [
        { code: 'CA', name: 'California' },
        { code: 'NY', name: 'New York' },
        { code: 'TX', name: 'Texas' }
    ],
    UK: [
        { code: 'LDN', name: 'London' },
        { code: 'ENG', name: 'England' },
        { code: 'SCT', name: 'Scotland' }
    ]
};

const citiesByState: Record<string, string[]> = {
    KA: ['Bangalore', 'Mysore', 'Hubli'],
    MH: ['Mumbai', 'Pune', 'Nagpur'],
    DL: ['New Delhi', 'Noida', 'Gurgaon'],
    CA: ['Los Angeles', 'San Francisco', 'San Diego'],
    NY: ['New York City', 'Buffalo', 'Rochester'],
    TX: ['Houston', 'Austin', 'Dallas'],
    LDN: ['City of London', 'Greenwich', 'Westminster'],
    ENG: ['Manchester', 'Birmingham', 'Liverpool'],
    SCT: ['Edinburgh', 'Glasgow', 'Aberdeen']
};

const Register: React.FC = () => {
    const navigate = useNavigate();
    const mode = useAppSelector((state) => state.theme.mode);
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const steps = ['Account Info', 'Personal Details', 'Address Info'];

    const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            phone: '',
            pinCode: '',
            currentAddress: '',
            isHomeSameAsCurrent: 'yes',
            homeAddress: '',
            country: '',
            state: '',
            city: '',
        }
    });

    const watchedCountry = watch('country');
    const watchedState = watch('state');
    const watchedIsHomeSameAsCurrent = watch('isHomeSameAsCurrent');

    useEffect(() => {
        if (watchedCountry) {
            setValue('state', '');
            setValue('city', '');
        }
    }, [watchedCountry, setValue]);

    useEffect(() => {
        if (watchedState) {
            setValue('city', '');
        }
    }, [watchedState, setValue]);

    const onSubmit = (data: RegisterFormData) => {
        console.log('Registration Data:', data);
        setIsSubmitted(true);
        setTimeout(() => {
            navigate(PATHS.LOGIN);
        }, 3000);
    };

    const nextStep = () => setActiveStep((prev) => prev + 1);
    const prevStep = () => setActiveStep((prev) => prev - 1);

    if (isSubmitted) {
        return (
            <div className={`min-vh-100 d-flex align-items-center justify-content-center py-5 ${mode === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}>
                <Card className={`p-5 text-center border-0 shadow rounded-4 ${mode === 'dark' ? 'bg-dark border-secondary' : 'bg-white'}`} style={{ maxWidth: '500px' }}>
                    <CheckCircle2 size={80} className="text-success mb-4" />
                    <h2 className="fw-bold mb-3">Registration Successful!</h2>
                    <p className="text-secondary">Your account has been created. Redirecting to login page...</p>
                </Card>
            </div>
        );
    }

    return (
        <div
            className={`min-vh-100 d-flex align-items-center py-5 ${mode === 'dark' ? 'bg-dark text-white' : 'bg-light'}`}
            style={{
                background: mode === 'dark'
                    ? 'linear-gradient(135deg, #0a1929 0%, #101f33 100%)'
                    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} lg={10} xl={9}>
                        <Card className={`border-0 shadow-lg rounded-4 ${mode === 'dark' ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-5">
                                    <div className="d-inline-flex p-3 rounded-3 mb-3 text-white" style={{ backgroundColor: '#007bff' }}>
                                        <ShieldCheck size={40} />
                                    </div>
                                    <h2 className="fw-bold">Create Industry Account</h2>
                                    <p className="text-secondary">Join our premium financial network</p>
                                </div>

                                <div className="mb-5 px-md-5">
                                    <div className="d-flex justify-content-between mb-2">
                                        {steps.map((label, index) => (
                                            <div key={label} className="text-center" style={{ width: '33%' }}>
                                                <div
                                                    className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${activeStep >= index ? 'bg-primary text-white' : 'bg-secondary-subtle text-secondary'}`}
                                                    style={{ width: '35px', height: '35px', fontWeight: 'bold' }}
                                                >
                                                    {index + 1}
                                                </div>
                                                <div className={`small d-none d-md-block fw-semibold ${activeStep >= index ? 'text-primary' : 'text-secondary'}`}>
                                                    {label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <ProgressBar now={((activeStep + 1) / steps.length) * 100} style={{ height: '6px' }} variant="primary" />
                                </div>

                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    {activeStep === 0 && (
                                        <Row className="g-4">
                                            <Col md={6}>
                                                <Form.Group controlId="regUsername">
                                                    <Form.Label className="fw-semibold small">Username</Form.Label>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text><User size={18} /></InputGroup.Text>
                                                        <Controller
                                                            name="username"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    {...field}
                                                                    isInvalid={!!errors.username}
                                                                    placeholder="Choose a username"
                                                                />
                                                            )}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="regEmail">
                                                    <Form.Label className="fw-semibold small">Email Address</Form.Label>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text><Mail size={18} /></InputGroup.Text>
                                                        <Controller
                                                            name="email"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    {...field}
                                                                    type="email"
                                                                    isInvalid={!!errors.email}
                                                                    placeholder="name@example.com"
                                                                />
                                                            )}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Group controlId="regPassword">
                                                    <Form.Label className="fw-semibold small">Password</Form.Label>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text><Lock size={18} /></InputGroup.Text>
                                                        <Controller
                                                            name="password"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    {...field}
                                                                    type="password"
                                                                    isInvalid={!!errors.password}
                                                                    placeholder="Min 8 characters"
                                                                />
                                                            )}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    )}

                                    {activeStep === 1 && (
                                        <Row className="g-4">
                                            <Col md={6}>
                                                <Form.Group controlId="regPhone">
                                                    <Form.Label className="fw-semibold small">Phone Number</Form.Label>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text><Phone size={18} /></InputGroup.Text>
                                                        <Controller
                                                            name="phone"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    {...field}
                                                                    isInvalid={!!errors.phone}
                                                                    placeholder="Phone number"
                                                                />
                                                            )}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="regPinCode">
                                                    <Form.Label className="fw-semibold small">Pin Code</Form.Label>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text><MapPin size={18} /></InputGroup.Text>
                                                        <Controller
                                                            name="pinCode"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    {...field}
                                                                    isInvalid={!!errors.pinCode}
                                                                    placeholder="6 digit PIN"
                                                                />
                                                            )}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.pinCode?.message}</Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="regCountry">
                                                    <Form.Label className="fw-semibold small">Country</Form.Label>
                                                    <div className="d-flex">
                                                        <div className="input-group-text rounded-end-0 border-end-0"><Globe size={18} /></div>
                                                        <Controller
                                                            name="country"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Select {...field} isInvalid={!!errors.country}>
                                                                    <option value="">Select Country</option>
                                                                    {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                                                </Form.Select>
                                                            )}
                                                        />
                                                    </div>
                                                    {errors.country && <div className="text-danger small mt-1">{errors.country.message}</div>}
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="regState">
                                                    <Form.Label className="fw-semibold small">State</Form.Label>
                                                    <div className="d-flex">
                                                        <div className="input-group-text rounded-end-0 border-end-0"><Building2 size={18} /></div>
                                                        <Controller
                                                            name="state"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Select {...field} isInvalid={!!errors.state} disabled={!watchedCountry}>
                                                                    <option value="">Select State</option>
                                                                    {watchedCountry && statesByCountry[watchedCountry]?.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                                                                </Form.Select>
                                                            )}
                                                        />
                                                    </div>
                                                    {errors.state && <div className="text-danger small mt-1">{errors.state.message}</div>}
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="regCity">
                                                    <Form.Label className="fw-semibold small">City</Form.Label>
                                                    <div className="d-flex">
                                                        <div className="input-group-text rounded-end-0 border-end-0"><MapPin size={18} /></div>
                                                        <Controller
                                                            name="city"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Select {...field} isInvalid={!!errors.city} disabled={!watchedState}>
                                                                    <option value="">Select City</option>
                                                                    {watchedState && citiesByState[watchedState]?.map(city => <option key={city} value={city}>{city}</option>)}
                                                                </Form.Select>
                                                            )}
                                                        />
                                                    </div>
                                                    {errors.city && <div className="text-danger small mt-1">{errors.city.message}</div>}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    )}

                                    {activeStep === 2 && (
                                        <div className="d-flex flex-column gap-4">
                                            <Form.Group controlId="regCurrentAddress">
                                                <Form.Label className="fw-semibold small">Current Address</Form.Label>
                                                <InputGroup hasValidation>
                                                    <InputGroup.Text className="align-items-start pt-2"><Home size={18} /></InputGroup.Text>
                                                    <Controller
                                                        name="currentAddress"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Form.Control
                                                                {...field}
                                                                as="textarea"
                                                                rows={3}
                                                                isInvalid={!!errors.currentAddress}
                                                                placeholder="Enter your current address"
                                                            />
                                                        )}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.currentAddress?.message}</Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>

                                            <div className="mt-2">
                                                <Form.Label className="fw-semibold small d-block mb-3">Is home address same as current address?</Form.Label>
                                                <Controller
                                                    name="isHomeSameAsCurrent"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="d-flex gap-4">
                                                            <Form.Check
                                                                type="radio"
                                                                label="Yes, same address"
                                                                name="isHomeSameAsCurrent"
                                                                id="sameYes"
                                                                value="yes"
                                                                checked={field.value === 'yes'}
                                                                onChange={field.onChange}
                                                            />
                                                            <Form.Check
                                                                type="radio"
                                                                label="No, different address"
                                                                name="isHomeSameAsCurrent"
                                                                id="sameNo"
                                                                value="no"
                                                                checked={field.value === 'no'}
                                                                onChange={field.onChange}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            {watchedIsHomeSameAsCurrent === 'no' && (
                                                <Form.Group controlId="regHomeAddress" className="mt-2">
                                                    <Form.Label className="fw-semibold small">Home Address</Form.Label>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text className="align-items-start pt-2"><Home size={18} /></InputGroup.Text>
                                                        <Controller
                                                            name="homeAddress"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Form.Control
                                                                    {...field}
                                                                    as="textarea"
                                                                    rows={3}
                                                                    isInvalid={!!errors.homeAddress}
                                                                    placeholder="Enter your home address"
                                                                />
                                                            )}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.homeAddress?.message}</Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            )}
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between mt-5">
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                disabled={activeStep === 0}
                                                onClick={prevStep}
                                                className="px-4 py-2 d-flex align-items-center"
                                            >
                                                <ArrowLeft size={18} className="me-2" /> Back
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => reset()}
                                                className="px-4 py-2 d-flex align-items-center"
                                            >
                                                <RotateCcw size={18} className="me-2" /> Reset
                                            </Button>
                                        </div>

                                        {activeStep < steps.length - 1 ? (
                                            <Button
                                                variant="primary"
                                                onClick={nextStep}
                                                className="px-5 py-2 d-flex align-items-center fw-bold"
                                            >
                                                Next <ArrowRight size={18} className="ms-2" />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="px-5 py-2 fw-bold"
                                            >
                                                Complete Registration
                                            </Button>
                                        )}
                                    </div>
                                </Form>

                                <hr className="my-5 border-secondary-subtle" />

                                <div className="text-center">
                                    <p className="text-secondary small">
                                        Already have an account?{' '}
                                        <Button
                                            variant="link"
                                            className="p-0 text-primary fw-bold text-decoration-none"
                                            onClick={() => navigate(PATHS.LOGIN)}
                                        >
                                            Sign In
                                        </Button>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
