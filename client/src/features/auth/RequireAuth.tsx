import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../api/globalSlice';

const RequireAuth = () => {
  const user = useAppSelector(selectUser);
  const location = useLocation();
  return (
    user ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />
  );
};

export default RequireAuth;