import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../data/useAuth";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Wait for auth to resolve before making routing decisions
    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <p className="text-gray-500 font-semibold animate-pulse">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}