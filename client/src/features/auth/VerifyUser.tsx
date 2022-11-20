import { useEffect, useRef, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import Loader from '../../components/Loader';
import PinInput from '../../components/PinInput';
import { selectUser } from '../api/globalSlice';
import { useResendVerifyEmailMutation, useVerifyUserMutation } from './authSlice';

const offscreen = 'absolute -left-[9999px]';
const onscreen = 'w-full bg-red-200 text-red-500 text-center rounded-md font-bold px-4 py-1';

const VerifyUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/lounge';
  const currentUser = useAppSelector(selectUser);
  const [verifyUser, { isLoading }] = useVerifyUserMutation({});
  const errRef = useRef<HTMLParagraphElement>(null);
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [resendVerifyEmail, { isLoading: resending }] = useResendVerifyEmailMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verifyUser(verifyCode).unwrap();
      navigate('/setprofilepicture', { replace: true });
    } catch (err: any) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.data) {
        setErrMsg(err.data.message);
      } else {
        setErrMsg('Verification Failed');
        setVerifyCode('');
      }
      errRef.current?.focus();
    }
  };
  const handleResend = async () => {
    try {
      await resendVerifyEmail({}).unwrap();
    } catch (err: any) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.data) {
        setErrMsg(err.data.message);
      } else {
        setErrMsg('Verification Failed');
      }
      errRef.current?.focus();
    }
  };

  useEffect(() => { setErrMsg(''); }, [verifyCode]);
  return (
    <>
      <p ref={errRef} className={errMsg ? onscreen : offscreen} aria-live='assertive'>{errMsg}</p>
      <h1 className='text-white text-2xl text-center font-semibold capitalize mb-2 justify-self-start'>Check your email</h1>
      <div className="w-full flex flex-col items-center space-y-8">
        <div className="flex flex-col items-center">
          <p className="text-secondaryGray text-sm text-center font-medium tracking-wider">We sent a verification email to</p>
          <h2 className="text-accentPurple text-lg text-center font-medium">{currentUser?.email}</h2>
        </div>
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center space-y-6'>
          <PinInput verifyCode={setVerifyCode} />
          <button type="submit" disabled={verifyCode ? false : true} className='bg-mainBlue py-3 w-full grid place-items-center rounded-xl text-sm text-white capitalize md:text-lg'>verify email</button>
        </form>
        <p className="text-xs text-white text-center">Didn't receive the email? Check your spam folder <button onClick={handleResend} className="text-accentPurple pl-1">or click to resend</button></p>
        <Link to={from} className="flex items-center space-x-1 text-sm text-accentPurple capitalize"><BsArrowLeft /><p>go back</p></Link>
      </div>
      {(isLoading || resending) && <Loader />}
    </>
  );
};

export default VerifyUser;