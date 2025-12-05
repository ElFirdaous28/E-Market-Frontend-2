import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = () => {
  const { user } = useSelector((state) => state.user);

  // If user is logged in, redirect immediately
  if (user) return <Navigate to="/" replace />;

  // Otherwise, allow access to login/register pages
  return <Outlet />;
};

export default GuestRoute;