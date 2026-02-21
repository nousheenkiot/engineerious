import { redirect } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { PATHS } from './paths';
import { store } from '../store';
import { setUserInfo } from '../features/auth/authSlice';

export const requireAuth = (activities: string[] = []) => {
    return async ({ request, params }: { request: Request; params: any }) => {
        const url = new URL(request.url);
        const token = localStorage.getItem('token');

        if (!token) {
            const searchParams = new URLSearchParams();
            searchParams.set('from', url.pathname);
            return redirect(`${PATHS.LOGIN}?${searchParams.toString()}`);
        }

        try {
            let user = store.getState().auth.user;

            // If user not in state, fetch it
            if (!user) {
                user = await authApi.getUserInfo();
                store.dispatch(setUserInfo(user));
            }

            // Check if URL username matches logged in user
            if (params.username && params.username !== user.username) {
                return redirect(PATHS.UNAUTHORIZED.replace(':username', user.username));
            }

            if (activities.length > 0) {
                const hasAccess = activities.every(activity =>
                    user?.activities.includes(activity)
                );

                if (!hasAccess) {
                    return redirect(PATHS.UNAUTHORIZED.replace(':username', params.username || user.username));
                }
            }

            return user;
        } catch (error) {
            console.error('Auth check failed:', error);
            // If fetching user info fails, token might be invalid
            localStorage.removeItem('token');
            const searchParams = new URLSearchParams();
            searchParams.set('from', url.pathname);
            return redirect(`${PATHS.LOGIN}?${searchParams.toString()}`);
        }
    };
};
