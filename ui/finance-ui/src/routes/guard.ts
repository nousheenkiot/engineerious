import { redirect } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { PATHS } from './paths';
import { store } from '../store';
import { setUserInfo } from '../features/auth/authSlice';

export const requireAuth = (activities: string[] = []) => {
    return async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const token = localStorage.getItem('token');

        if (!token) {
            const params = new URLSearchParams();
            params.set('from', url.pathname);
            return redirect(`${PATHS.LOGIN}?${params.toString()}`);
        }

        try {
            let user = store.getState().auth.user;

            // If user not in state, fetch it
            if (!user) {
                user = await authApi.getUserInfo();
                store.dispatch(setUserInfo(user));
            }

            if (activities.length > 0) {
                const hasAccess = activities.every(activity =>
                    user?.activities.includes(activity)
                );

                if (!hasAccess) {
                    return redirect(PATHS.UNAUTHORIZED);
                }
            }

            return user;
        } catch (error) {
            console.error('Auth check failed:', error);
            // If fetching user info fails, token might be invalid
            localStorage.removeItem('token');
            const params = new URLSearchParams();
            params.set('from', url.pathname);
            return redirect(`${PATHS.LOGIN}?${params.toString()}`);
        }
    };
};
