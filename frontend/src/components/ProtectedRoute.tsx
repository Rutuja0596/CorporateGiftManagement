import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');

  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;

  try {
    const decoded: any = jwtDecode(token);
    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/campaigns" replace />; // Redirect users trying to access admin
    }
    return <Outlet />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};