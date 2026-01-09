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
        try {
            const response = await api.post<LoginResponse>('api/auth/login', credentials);
            const data = response.data;
            if (data.token) {
                localStorage.setItem('token', data.token);
                // After login, fetch user info to get roles/activities
                const userInfo = await authApi.getUserInfo();
                return { token: data.token, user: userInfo };
            }
            throw new Error('No token received');
        } catch (error: any) {
            console.error("Login failed:", error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    getUserInfo: async (): Promise<UserInfo> => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        try {
            const response = await api.get<UserInfo>('api/auth/userinfo');
            return response.data;
        } catch (error) {
            // If fetching user info fails (e.g., token expired), clear token
            localStorage.removeItem('token');
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        localStorage.removeItem('token');
        // If there's a backend logout endpoint that invalidates tokens (e.g. blocklist), call it here
        // await api.post('api/auth/logout');
    }
};
