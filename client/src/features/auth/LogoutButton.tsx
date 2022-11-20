import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useLogoutMutation } from './authSlice';

const LogoutButton = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      navigate('/login', { replace: true });
    } catch (err) { console.log(err); }
  };
  return (
    <div className="grid place-items-center w-full my-10">
      <button onClick={handleLogout} className='flex justify-center bg-transparent border border-mainBlue rounded-xl py-2 px-20 text-base text-mainBlue font-medium tracking-wide capitalize shadow-md'>log out</button>
      {isLoading && <Loader />}
    </div>
  );
};


export default LogoutButton;