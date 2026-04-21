import { Navigate } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";
import { useAuth } from "../hooks/api/useAuth";
import type { UserRole } from "../types/user";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user?.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "officer")
      return <Navigate to="/officer/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
