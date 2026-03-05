import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

/**
 * Wraps routes that require authentication.
 * Reads the lightweight user object from localStorage (set on login/register).
 * If absent, redirects to /login and preserves the intended destination via `state.from`.
 */
const ProtectedRoute = ({ children }: Props) => {
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('user');

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
