import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useLogoutMutation } from './authSlice';

interface logoutInterface {
  buttonStyle: string;
  loading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutButton = ({ buttonStyle, loading }: logoutInterface) => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      navigate('/login', { replace: true });
    } catch (err) { console.log(err); }
  };
  useEffect(() => { loading && loading(isLoading); }, [isLoading, loading]);
  return (
    <>
      <button onClick={handleLogout} className={buttonStyle}>log out</button>
      {loading ? '' : isLoading && <Loader />}
    </>
  );
};


export default LogoutButton;