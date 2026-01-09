import api from './axios';

export interface UserActivity {
    id: number;
    activityName: string;
    description: string;
}

export interface UserInfo {
    username: string;
    activities: string[];
    roles: string[];
}

export interface LoginResponse {
    token: string;
    user: UserInfo;
}

export const authApi = {
    login: async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
        // In a real app, this would be an actual API call
        // For this task, we implement the mock logic here
        if (credentials.username === 'user' && credentials.password === 'test') {
            return {
                token: 'mock-jwt-token',
                user: {
                    username: 'user',
                    activities: ['COHORT_PAGINATION', 'COHORT_VIEW', 'CASHFLOW_PAGINATION', 'CASHFLOW_VIEW'],
                    roles: ['ROLE_USER']
                }
            };
        }

        throw new Error('Invalid username or password');

        // Real implementation would be:
        // const response = await api.post<LoginResponse>('api/auth/login', credentials);
        // return response.data;
    },

    getUserInfo: async (): Promise<UserInfo> => {
        const response = await api.get<UserInfo>('api/auth/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        // localStorage.removeItem('token');
        // await api.post('api/auth/logout');
    },

    getMockUserInfo: async (): Promise<UserInfo> => {
        return {
            username: 'user',
            activities: ['COHORT_PAGINATION', 'COHORT_VIEW', 'CASHFLOW_PAGINATION', 'CASHFLOW_VIEW'],
            roles: ['ROLE_USER']
        };
    }
};
