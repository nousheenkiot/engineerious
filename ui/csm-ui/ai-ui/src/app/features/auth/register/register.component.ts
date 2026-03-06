import { Component, OnInit } from '@angular/core';
import {
    FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UserRole, RegistrationData } from '../../../core/models/user.model';

// ── Custom Validators ────────────────────────────────────────────────────────
export function panValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value?.toUpperCase();
    return val && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val) ? null : { invalidPan: true };
}

export function aadhaarValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value?.replace(/\s/g, '');
    return val && /^\d{12}$/.test(val) ? null : { invalidAadhaar: true };
}

export function ifscValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value?.toUpperCase();
    return val && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val) ? null : { invalidIfsc: true };
}

export function mobileValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    return val && /^[6-9]\d{9}$/.test(val) ? null : { invalidMobile: true };
}

export function pincodeValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    return val && /^[1-9][0-9]{5}$/.test(val) ? null : { invalidPincode: true };
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
}

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val) return { required: true };
    const errors: ValidationErrors = {};
    if (!/[A-Z]/.test(val)) errors['noUppercase'] = true;
    if (!/[a-z]/.test(val)) errors['noLowercase'] = true;
    if (!/[0-9]/.test(val)) errors['noNumber'] = true;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) errors['noSpecial'] = true;
    if (val.length < 8) errors['minlength'] = true;
    return Object.keys(errors).length ? errors : null;
}

// ── Location Data ────────────────────────────────────────────────────────────
export const COUNTRIES = ['India'];

export const STATES_BY_COUNTRY: Record<string, string[]> = {
    India: [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
        'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
        'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
        'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh'
    ]
};

export const CITIES_BY_STATE: Record<string, string[]> = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
    'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Noida', 'Gurugram'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Ghaziabad'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'],
};

@Component({
    selector: 'app-register',
    standalone: false,
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    currentStep = 1;
    totalSteps = 5;
    isLoading = false;
    error = '';
    showPassword = false;
    showConfirmPassword = false;

    // Location cascades
    countries = COUNTRIES;
    states: string[] = [];
    cities: string[] = [];

    // Role options
    roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
        { value: 'CUSTOMER', label: 'Customer', icon: '👤', desc: 'Buy & manage policies' },
        { value: 'AGENT', label: 'Agent', icon: '🧑‍💼', desc: 'Onboard clients & policies' },
        { value: 'UNDERWRITER', label: 'Underwriter', icon: '📊', desc: 'Assess risk & approve policies' },
        { value: 'CLAIMS_MANAGER', label: 'Claims Manager', icon: '📋', desc: 'Process & approve claims' },
        { value: 'ADMIN', label: 'Admin', icon: '⚙️', desc: 'Full platform access' },
    ];

    steps = [
        { id: 1, label: 'Account', icon: '🔐' },
        { id: 2, label: 'Personal', icon: '👤' },
        { id: 3, label: 'KYC', icon: '🪪' },
        { id: 4, label: 'Policy', icon: '📋' },
        { id: 5, label: 'Health', icon: '🏥' },
    ];

    form!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.form = this.fb.group({
            // ── Step 1: Account ──────────────────────────────────────────────────
            step1: this.fb.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, strongPasswordValidator]],
                confirmPassword: ['', Validators.required],
                role: ['CUSTOMER', Validators.required],
            }, { validators: passwordMatchValidator }),

            // ── Step 2: Personal & Address ───────────────────────────────────────
            step2: this.fb.group({
                fullName: ['', [Validators.required, Validators.minLength(3)]],
                dateOfBirth: ['', Validators.required],
                gender: ['', Validators.required],
                mobileNumber: ['', [Validators.required, mobileValidator]],
                maritalStatus: ['', Validators.required],
                occupation: ['', Validators.required],
                annualIncome: [null, [Validators.required, Validators.min(0)]],
                permanentAddress: ['', [Validators.required, Validators.minLength(10)]],
                country: ['India', Validators.required],
                state: ['', Validators.required],
                city: ['', Validators.required],
                pincode: ['', [Validators.required, pincodeValidator]],
            }),

            // ── Step 3: KYC & Banking ────────────────────────────────────────────
            step3: this.fb.group({
                panNumber: ['', [Validators.required, panValidator]],
                aadhaarNumber: ['', [Validators.required, aadhaarValidator]],
                bankName: ['', Validators.required],
                bankAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
                ifscCode: ['', [Validators.required, ifscValidator]],
                nomineeName: ['', Validators.required],
                nomineeRelationship: ['', Validators.required],
            }),

            // ── Step 4: Policy Details ────────────────────────────────────────────
            step4: this.fb.group({
                policyTerm: [null, [Validators.required, Validators.min(1), Validators.max(40)]],
                sumAssured: [null, [Validators.required, Validators.min(100000)]],
            }),

            // ── Step 5: Health & Declaration ─────────────────────────────────────
            step5: this.fb.group({
                medicalHistory: ['', Validators.required],
                smokingStatus: ['', Validators.required],
                height: [null, [Validators.required, Validators.min(50), Validators.max(250)]],
                weight: [null, [Validators.required, Validators.min(10), Validators.max(300)]],
                declarationConsent: [false, Validators.requiredTrue],
            }),
        });

        // Country → State cascade
        this.step2.get('country')!.valueChanges.subscribe(c => {
            this.states = STATES_BY_COUNTRY[c] ?? [];
            this.step2.get('state')!.reset('');
            this.cities = [];
            this.step2.get('city')!.reset('');
        });
        this.states = STATES_BY_COUNTRY['India'];

        // State → City cascade
        this.step2.get('state')!.valueChanges.subscribe(s => {
            this.cities = CITIES_BY_STATE[s] ?? [];
            this.step2.get('city')!.reset('');
        });
    }

    // ── Getters ──────────────────────────────────────────────────────────────
    get step1() { return this.form.get('step1') as FormGroup; }
    get step2() { return this.form.get('step2') as FormGroup; }
    get step3() { return this.form.get('step3') as FormGroup; }
    get step4() { return this.form.get('step4') as FormGroup; }
    get step5() { return this.form.get('step5') as FormGroup; }

    get currentStepGroup(): FormGroup {
        return this.form.get(`step${this.currentStep}`) as FormGroup;
    }

    get progressPercent(): number {
        return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    }

    f(step: number, field: string): AbstractControl {
        return (this.form.get(`step${step}`) as FormGroup).get(field)!;
    }

    hasErr(step: number, field: string, err: string): boolean {
        const c = this.f(step, field);
        return c.touched && (c.errors?.[err] ?? false);
    }

    passwordStrength(): { label: string; percent: number; color: string } {
        const val = this.f(1, 'password').value ?? '';
        let score = 0;
        if (/[A-Z]/.test(val)) score++;
        if (/[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) score++;
        if (val.length >= 8) score++;

        if (score <= 1) return { label: 'Very Weak', percent: 20, color: '#ef4444' };
        if (score === 2) return { label: 'Weak', percent: 40, color: '#f97316' };
        if (score === 3) return { label: 'Fair', percent: 60, color: '#eab308' };
        if (score === 4) return { label: 'Strong', percent: 80, color: '#22c55e' };
        return { label: 'Very Strong', percent: 100, color: '#10b981' };
    }

    getStepError(): string {
        const sg = this.currentStepGroup;
        if (sg === this.step1 && sg.errors?.['passwordMismatch']) {
            return 'Passwords do not match';
        }
        return '';
    }

    // ── Navigation ────────────────────────────────────────────────────────────
    nextStep(): void {
        this.currentStepGroup.markAllAsTouched();
        const sg = this.currentStepGroup;

        if (sg.invalid) {
            this.error = 'Please complete all required fields correctly before proceeding.';
            return;
        }
        if (this.currentStep === 1 && this.step1.errors?.['passwordMismatch']) {
            this.error = 'Passwords do not match.';
            return;
        }
        this.error = '';
        this.currentStep++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    prevStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.error = '';
        }
    }

    goToStep(step: number): void {
        if (step < this.currentStep) {
            this.currentStep = step;
            this.error = '';
        }
    }

    // ── Submit ────────────────────────────────────────────────────────────────
    onSubmit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) {
            this.error = 'Please review all fields before submitting.';
            return;
        }

        this.isLoading = true;
        this.error = '';

        const s1 = this.step1.value;
        const s2 = this.step2.value;
        const s3 = this.step3.value;
        const s4 = this.step4.value;
        const s5 = this.step5.value;

        const payload: RegistrationData = {
            email: s1.email,
            password: s1.password,
            confirmPassword: s1.confirmPassword,
            role: s1.role,
            fullName: s2.fullName,
            dateOfBirth: s2.dateOfBirth,
            gender: s2.gender,
            mobileNumber: s2.mobileNumber,
            maritalStatus: s2.maritalStatus,
            occupation: s2.occupation,
            annualIncome: s2.annualIncome,
            permanentAddress: s2.permanentAddress,
            country: s2.country,
            state: s2.state,
            city: s2.city,
            pincode: s2.pincode,
            panNumber: s3.panNumber?.toUpperCase(),
            aadhaarNumber: s3.aadhaarNumber?.replace(/\s/g, ''),
            bankName: s3.bankName,
            bankAccountNumber: s3.bankAccountNumber,
            ifscCode: s3.ifscCode?.toUpperCase(),
            nomineeName: s3.nomineeName,
            nomineeRelationship: s3.nomineeRelationship,
            policyTerm: s4.policyTerm,
            sumAssured: s4.sumAssured,
            medicalHistory: s5.medicalHistory,
            smokingStatus: s5.smokingStatus,
            height: s5.height,
            weight: s5.weight,
            declarationConsent: s5.declarationConsent,
        };

        this.authService.register(payload).subscribe({
            next: (user) => {
                this.isLoading = false;
                this.router.navigate([this.authService.getDefaultRouteForRole(user.role)]);
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.message || 'Registration failed. Please try again.';
            }
        });
    }

    goToLogin(): void {
        this.router.navigate(['/auth/login']);
    }
}
