import { type ComponentType, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { PATHS } from '../routes/paths';

interface WithAuthOptions {
    requiredActivities?: string[];
}

/**
 * HOC that protects components by checking for authentication and optional required activities.
 */
export function withAuth<P extends object>(
    WrappedComponent: ComponentType<P>,
    options: WithAuthOptions = {}
) {
    return (props: P) => {
        const { user, isAuthenticated } = useAppSelector((state) => state.auth);
        const navigate = useNavigate();
        const location = useLocation();
        const { requiredActivities = [] } = options;

        useEffect(() => {
            if (!isAuthenticated) {
                const searchParams = new URLSearchParams();
                searchParams.set('from', location.pathname);
                navigate(`${PATHS.LOGIN}?${searchParams.toString()}`);
                return;
            }

            if (requiredActivities.length > 0 && user) {
                const hasAccess = requiredActivities.every((activity) =>
                    user.activities.includes(activity)
                );

                if (!hasAccess) {
                    navigate(PATHS.UNAUTHORIZED.replace(':username', user.username));
                }
            }
        }, [isAuthenticated, user, navigate, location, requiredActivities]);

        // If not authenticated, we're about to redirect, so show nothing or a loader
        if (!isAuthenticated) {
            return null;
        }

        // Check activity access
        if (requiredActivities.length > 0 && user) {
            const hasAccess = requiredActivities.every((activity) =>
                user.activities.includes(activity)
            );
            if (!hasAccess) return null;
        }

        return <WrappedComponent {...props} />;
    };
}
