import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import Loader from '../../components/Loader';
import { useRefreshQuery } from './authSlice';
import { selectUser } from '../api/globalSlice';

const PersistLogin = () => {
  const isPersist = localStorage.getItem('persist');
  const user = useAppSelector(selectUser);
  const persist = isPersist && JSON.parse(isPersist);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSuccess, isError, error } = useRefreshQuery({});

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
    } else if (isError) {
      setIsLoading(false);
    }
  }, [isSuccess, isError, error]);
  return (
    !persist || user ? <Outlet /> : isLoading ? <Loader /> : <Outlet />
  );
};

export default PersistLogin;