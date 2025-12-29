export interface Policy {
    id: number;
    policyNumber: string;
    holderName: string;
    premium: number;
    version?: number;
    fyDate: string;
    assumption: 'AGGRESSIVE' | 'CONSERVATIVE' | 'MODERATE'; // Align with PolicyAssumption enum
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface SearchParams {
    query?: string;
    page: number;
    size: number;
    sortBy: string;
    sortDir: 'asc' | 'desc';
}
