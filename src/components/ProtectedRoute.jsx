import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole = 'ADMIN' }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line ri-spin text-4xl text-cecati"></i>
          <p className="text-sm font-medium text-gray-400">Verificando credenciales de acceso...</p>
        </div>
      </div>
    );
  }

  // Strict Default-Deny: If no user or role doesn't match, block access and redirect
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
