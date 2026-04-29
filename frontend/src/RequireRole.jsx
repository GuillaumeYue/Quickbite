import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles.indexOf(user.role) === -1) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RequireRole;
