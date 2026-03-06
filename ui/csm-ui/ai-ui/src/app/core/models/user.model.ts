export type UserRole = 'ADMIN' | 'AGENT' | 'CUSTOMER' | 'UNDERWRITER' | 'CLAIMS_MANAGER';

export interface Activity {
    id: string;
    label: string;
    description: string;
}

export const ROLE_ACTIVITIES: Record<UserRole, Activity[]> = {
    ADMIN: [
        { id: 'manage_users', label: 'Manage Users', description: 'Create, update, delete users' },
        { id: 'view_reports', label: 'View Reports', description: 'Access all reports' },
        { id: 'manage_policies', label: 'Manage Policies', description: 'Full policy control' },
        { id: 'manage_roles', label: 'Manage Roles', description: 'Assign roles to users' },
    ],
    AGENT: [
        { id: 'create_policy', label: 'Create Policy', description: 'Initiate new policies' },
        { id: 'view_clients', label: 'View Clients', description: 'Access client profiles' },
        { id: 'submit_claims', label: 'Submit Claims', description: 'File claims on behalf of clients' },
    ],
    CUSTOMER: [
        { id: 'view_own_policy', label: 'View My Policy', description: 'View personal policy details' },
        { id: 'submit_claim', label: 'Submit Claim', description: 'Submit a personal claim' },
        { id: 'update_profile', label: 'Update Profile', description: 'Edit personal details' },
    ],
    UNDERWRITER: [
        { id: 'assess_risk', label: 'Assess Risk', description: 'Evaluate policy risk' },
        { id: 'approve_policy', label: 'Approve Policy', description: 'Approve or reject policies' },
        { id: 'view_medical', label: 'View Medical Data', description: 'Access applicant medical history' },
    ],
    CLAIMS_MANAGER: [
        { id: 'process_claims', label: 'Process Claims', description: 'Review and process claims' },
        { id: 'approve_claims', label: 'Approve Claims', description: 'Approve or reject claims' },
        { id: 'view_reports', label: 'View Reports', description: 'Access claims reports' },
    ],
};

export interface User {
    id?: string;
    email: string;
    role: UserRole;
    fullName: string;
    activities?: string[];
    token?: string;
    profileComplete?: boolean;
}

export interface RegistrationData {
    // Personal
    fullName: string;
    dateOfBirth: string;
    gender: string;
    mobileNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;

    // Address
    permanentAddress: string;
    country: string;
    state: string;
    city: string;
    pincode: string;

    // Personal Status
    maritalStatus: string;
    occupation: string;
    annualIncome: number;

    // KYC
    panNumber: string;
    aadhaarNumber: string;

    // Banking
    bankAccountNumber: string;
    ifscCode: string;
    bankName: string;

    // Nominee
    nomineeName: string;
    nomineeRelationship: string;

    // Policy
    policyTerm: number;
    sumAssured: number;

    // Health
    medicalHistory: string;
    smokingStatus: string;
    height: number;
    weight: number;

    // Declaration
    declarationConsent: boolean;
}
