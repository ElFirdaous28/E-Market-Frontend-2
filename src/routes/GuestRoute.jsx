import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading... from GuestRoute</div>;

  // If user is logged in, redirect to a default protected page
  if (user) return <Navigate to="/" replace />;

  // Otherwise, allow access to login/register pages
  return <Outlet />;
};

export default GuestRoute;
