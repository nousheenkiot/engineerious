import api from './axios';
import type { Page, Policy, SearchParams } from '../types';

export const cohortApi = {
    search: async (params: SearchParams): Promise<Page<Policy>> => {
        const response = await api.get<Page<Policy>>('/api/policies/search', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Policy> => {
        const response = await api.get<Policy>(`/api/policies/${id}`);
        return response.data;
    },

    create: async (policy: Omit<Policy, 'id'>): Promise<Policy> => {
        const response = await api.post<Policy>('/api/policies', policy);
        return response.data;
    },

    update: async (id: number, policy: Partial<Policy>): Promise<Policy> => {
        const response = await api.put<Policy>(`/api/policies/${id}`, policy);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/policies/${id}`);
    },

    loadPolicies: async (date: string): Promise<string> => {
        const response = await api.post(`/api/policies/load?date=${date}`);
        return response.data;
    }
};
