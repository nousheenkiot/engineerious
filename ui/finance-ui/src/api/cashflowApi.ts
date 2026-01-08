import api from './axios';

export interface Cashflow {
    id: number;
    contractId: string;
    amount: number;
    currency: string;
    cashflowDate: string;
    assumptionType: string;
    status: 'PENDING' | 'SUCCESS' | 'REVERSED' | 'FAILED';
    createdAt: string;
    updatedAt: string;
}

export const cashflowApi = {
    getByContractId: async (contractId: string): Promise<Cashflow[]> => {
        const response = await api.get<Cashflow[]>(`api/cashflow/contract/${contractId}`);
        return response.data;
    },
    record: async (cashflow: Partial<Cashflow>): Promise<Cashflow> => {
        const response = await api.post<Cashflow>('api/cashflow/record', cashflow);
        return response.data;
    }
};
