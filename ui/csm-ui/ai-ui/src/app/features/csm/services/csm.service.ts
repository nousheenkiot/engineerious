import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ContractCsm } from '../../../shared/models/contract-csm.model';

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

@Injectable({
    providedIn: 'root'
})
export class CsmService {
    private apiUrl = 'api/csm'; // Mock URL

    // Mock data
    private mockData: ContractCsm[] = [
        {
            id: '1',
            contractId: 'CTR-2023-001',
            portfolioId: 'PF-001',
            initialCsm: 10000,
            currentCsm: 9500,
            currency: 'USD',
            status: 'Active',
            startDate: new Date('2023-01-01'),
            endDate: new Date('2024-01-01'),
            fulfillmentCashFlows: 50000,
            riskAdjustment: 200,
            lossComponent: 0,
            coverageUnits: 12,
            recognizedProfit: 500
        },
        {
            id: '2',
            contractId: 'CTR-2023-002',
            portfolioId: 'PF-001',
            initialCsm: 5000,
            currentCsm: 5000,
            currency: 'EUR',
            status: 'Pending',
            startDate: new Date('2023-06-01'),
            endDate: new Date('2024-06-01'),
            fulfillmentCashFlows: 25000,
            riskAdjustment: 100,
            lossComponent: 0,
            coverageUnits: 24,
            recognizedProfit: 0
        },
        {
            id: '3',
            contractId: 'CTR-2023-003',
            portfolioId: 'PF-002',
            initialCsm: 7500,
            currentCsm: 7200,
            currency: 'USD',
            status: 'Active',
            startDate: new Date('2023-03-01'),
            endDate: new Date('2024-03-01'),
            fulfillmentCashFlows: 30000,
            riskAdjustment: 150,
            lossComponent: 0,
            coverageUnits: 12,
            recognizedProfit: 300
        },
        {
            id: '4',
            contractId: 'CTR-2023-004',
            portfolioId: 'PF-002',
            initialCsm: 6000,
            currentCsm: 1000,
            currency: 'GBP',
            status: 'Closed',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2023-01-01'),
            fulfillmentCashFlows: 10000,
            riskAdjustment: 50,
            lossComponent: 0,
            coverageUnits: 12,
            recognizedProfit: 5000
        },
        {
            id: '5',
            contractId: 'CTR-2023-005',
            portfolioId: 'PF-003',
            initialCsm: 12000,
            currentCsm: 11800,
            currency: 'USD',
            status: 'Active',
            startDate: new Date('2023-08-01'),
            endDate: new Date('2024-08-01'),
            fulfillmentCashFlows: 60000,
            riskAdjustment: 300,
            lossComponent: 0,
            coverageUnits: 24,
            recognizedProfit: 200
        }
    ];

    constructor(private http: HttpClient) { }

    getContracts(page: number = 0, size: number = 10): Observable<Page<ContractCsm>> {
        // Use HttpClient to fetch data from real API
        // return this.http.get<Page<ContractCsm>>(`${this.apiUrl}?page=${page}&size=${size}`);

        // For now, keep mock implementation
        const start = page * size;
        const end = start + size;
        const pagedData = this.mockData.slice(start, end);

        const pageResult: Page<ContractCsm> = {
            content: pagedData,
            totalElements: this.mockData.length,
            totalPages: Math.ceil(this.mockData.length / size),
            size: size,
            number: page
        };

        return of(pageResult).pipe(delay(500));
    }

    getContract(id: string): Observable<ContractCsm | undefined> {
        // return this.http.get<ContractCsm>(`${this.apiUrl}/${id}`);
        const contract = this.mockData.find(c => c.id === id);
        return of(contract ? { ...contract } : undefined).pipe(delay(500));
    }

    updateContract(id: string, contract: ContractCsm): Observable<ContractCsm> {
        // return this.http.put<ContractCsm>(`${this.apiUrl}/${id}`, contract);
        const index = this.mockData.findIndex(c => c.id === id);
        if (index !== -1) {
            this.mockData[index] = { ...contract, id }; // Ensure ID matches
            return of(this.mockData[index]).pipe(delay(500));
        }
        throw new Error('Contract not found');
    }
}
